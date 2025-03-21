/*
 Copyright (c) 2025 gematik GmbH
 Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:
    https://joinup.ec.europa.eu/software/page/eupl
        Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and
 limitations under the Licence.
 */



import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BedOccupancy, Notification } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { SubmitNotificationDialogComponent } from '../dialogs/submit-notification-dialog/submit-notification-dialog.component';
import { FhirNotificationService } from './fhir-notification.service';
import { ValidateBedOccupancyNotificationService } from './validate-bed-occupancy-notification.service';
import NotificationTypeEnum = Notification.NotificationTypeEnum;
import { MatDialog } from '@angular/material/dialog';
import { cloneObject } from '@gematik/demis-portal-core-library';

@Injectable({
  providedIn: 'root',
})
export class FhirBedOccupancyService extends FhirNotificationService {
  constructor(
    protected override httpClient: HttpClient,
    protected override logger: NGXLogger,
    public dialog: MatDialog,
    private validateBedOccupancyService: ValidateBedOccupancyNotificationService
  ) {
    super(httpClient, logger);
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

  override sendNotification(notification: Notification) {
    let clonedNotificationObject: Notification = cloneObject(notification);
    return super.sendNotification(clonedNotificationObject);
  }

  openSubmitDialog(notification: BedOccupancy) {
    this.dialog.open(SubmitNotificationDialogComponent, {
      disableClose: true,
      maxWidth: '50vw',
      minHeight: '40vh',
      panelClass: 'app-submit-notification-dialog-panel',
      data: {
        notification: {
          notificationType: NotificationTypeEnum.BedOccupancy,
          bedOccupancy: notification,
        } as Notification,
        fhirService: this,
      },
    });
  }
}
