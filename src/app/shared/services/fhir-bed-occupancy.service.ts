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

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BedOccupancy } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { SubmitNotificationDialogComponent } from '../dialogs/submit-notification-dialog/submit-notification-dialog.component';
import { FhirNotificationService } from './fhir-notification.service';
import { ValidateBedOccupancyNotificationService } from './validate-bed-occupancy-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { cloneObject } from '@gematik/demis-portal-core-library';

@Injectable({
  providedIn: 'root',
})
export class FhirBedOccupancyService extends FhirNotificationService {
  protected override httpClient: HttpClient;
  protected override logger: NGXLogger;
  dialog = inject(MatDialog);
  private readonly validateBedOccupancyService = inject(ValidateBedOccupancyNotificationService);

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

  validateNotification(notification: any): boolean {
    const bedOccupancy: BedOccupancy = notification as BedOccupancy;
    return this.validateBedOccupancyService.validateNotification(bedOccupancy);
  }

  override sendNotification(notification: BedOccupancy) {
    let clonedNotificationObject: BedOccupancy = cloneObject(notification);
    return super.sendNotification(clonedNotificationObject);
  }

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
}
