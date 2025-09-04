/*
    Copyright (c) 2025 gematik GmbH
    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
    European Commission – subsequent versions of the EUPL (the "Licence").
    You may not use this work except in compliance with the Licence.
    You find a copy of the Licence in the "Licence" file or at
    https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
    Unless required by applicable law or agreed to in writing,
    software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
    In case of changes by gematik find details in the "Readme" file.
    See the Licence for the specific language governing permissions and limitations under the Licence.
    *******
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BedOccupancy, ValidationError } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { SubmitNotificationDialogComponent } from '../dialogs/submit-notification-dialog/submit-notification-dialog.component';
import { FhirNotificationService } from './fhir-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { cloneObject, MessageDialogService, trimStrings, SubmitDialogProps } from '@gematik/demis-portal-core-library';
import { environment } from '../../../environments/environment';
import { FileService } from './file.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FhirBedOccupancyService extends FhirNotificationService {
  protected override httpClient: HttpClient;
  protected override logger: NGXLogger;
  dialog = inject(MatDialog);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly fileService = inject(FileService);

  constructor() {
    const httpClient = inject(HttpClient);
    const logger = inject(NGXLogger);

    super();

    this.httpClient = httpClient;
    this.logger = logger;
  }

  transformData(originalData: BedOccupancy): any {
    //contacts (backend) is expecting an array and not like the datamodel is provided an object.

    const transformedContacts = Array.isArray(originalData.notifierFacility.contacts)
      ? originalData.notifierFacility.contacts
      : [
          //@ts-ignore
          ...(originalData.notifierFacility.contacts?.phoneNumbers || []),
          //@ts-ignore
          ...(originalData.notifierFacility.contacts?.emailAddresses || []),
        ];

    const transformedData: any = {
      notifierFacility: {
        ...originalData.notifierFacility,
        contacts: transformedContacts,
      },
      bedOccupancyQuestion: originalData.bedOccupancyQuestion,
    };

    return transformedData;
  }

  override sendNotification(notification: BedOccupancy) {
    let clonedNotificationObject: BedOccupancy = cloneObject(notification);
    return super.sendNotification(clonedNotificationObject);
  }

  /**
   * @deprecated Use {@link submitNotification} instead, once FEATURE_FLAG_PORTAL_SUBMIT will be removed
   */
  openSubmitDialog(notification: BedOccupancy) {
    this.dialog.open(SubmitNotificationDialogComponent, {
      disableClose: true,
      maxWidth: '50vw',
      minHeight: '40vh',
      panelClass: 'app-submit-notification-dialog-panel',
      data: {
        notification: notification,
        fhirService: this,
      },
    });
  }

  submitNotification(notification: BedOccupancy) {
    this.messageDialogService.showSpinnerDialog({ message: 'Meldung wird gesendet' });

    const trimmedNotification = trimStrings(notification);
    this.httpClient
      .post(environment.pathToBedOccupancy, JSON.stringify(trimmedNotification), {
        headers: FhirBedOccupancyService.getEnvironmentHeaders(),
        observe: 'response',
      })
      .pipe(
        finalize(() => {
          this.messageDialogService.closeSpinnerDialog();
        })
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          const submitDialogData = this.createSubmitDialogData(response, notification);
          this.messageDialogService.showSubmitDialog(submitDialogData);
        },
        error: err => {
          this.logger.error('error', err);
          const errors = this.extractErrorDetails(err);
          this.messageDialogService.showErrorDialog({
            errorTitle: 'Meldung konnte nicht zugestellt werden!',
            errors,
          });
        },
      });
  }

  private createSubmitDialogData(response: HttpResponse<any>, notification: BedOccupancy): SubmitDialogProps {
    const content = encodeURIComponent(response.body.content);
    const href = 'data:application/actet-stream;base64,' + content;
    return {
      authorEmail: response.body.authorEmail,
      fileName: this.fileService.getFileNameByNotificationType(notification),
      href: href,
      notificationId: response.body.notificationId,
      timestamp: response.body.timestamp,
    };
  }

  private extractErrorDetails(err: any): { text: string; queryString: string }[] {
    const response = err?.error ?? err;
    const errorMessage = this.messageDialogService.extractMessageFromError(response);
    const validationErrors = response?.validationErrors || [];
    if (validationErrors.length > 0) {
      return validationErrors.map((ve: ValidationError) => ({
        text: ve.message,
        queryString: ve.message || '',
      }));
    } else {
      return [
        {
          text: errorMessage,
          queryString: errorMessage || '',
        },
      ];
    }
  }

  private static getEnvironmentHeaders(): HttpHeaders {
    return environment.headers;
  }
}
