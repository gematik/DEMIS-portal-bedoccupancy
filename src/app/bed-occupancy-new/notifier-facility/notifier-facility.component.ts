/*
    Copyright (c) 2026 gematik GmbH
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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MaxHeightContentContainerComponent,
  MessageDialogService,
  SectionHeaderComponent,
  StepContentComponent,
  StepNavigation,
} from '@gematik/demis-portal-core-library';
import { Subscription } from 'rxjs';
import { BedOccupancyNotificationService } from '../bed-occupancy-notification.service';
import { HospitalLocation } from '../../shared/models/hospital-location';
import { notifierFacilityBedOccupancyFormConfigFields } from '../../shared/formly/configs/bed-occupancy/notifier-facility.config';
import { BedOccupancyStorageService } from '../../shared/services/bed-occupancy-storage.service';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { BedOccupancyConstants } from '../../bed-occupancy/common/bed-occupancy-constants';

@Component({
  selector: 'app-notifier-facility',
  imports: [FormlyForm, MatButton, MatIcon, MatToolbar, MatToolbarRow, SectionHeaderComponent, MaxHeightContentContainerComponent],
  templateUrl: './notifier-facility.component.html',
  styleUrl: './notifier-facility.component.scss',
})
export class NotifierFacilityComponent extends StepContentComponent<void> implements OnInit, OnDestroy {
  hospitalLocationsSubscription: Subscription | undefined;
  IkNumber: string;
  protected navigation = inject(StepNavigation);
  private readonly messageDialogService = inject(MessageDialogService);

  private readonly bedOccupancyStorageService = inject(BedOccupancyStorageService);
  hospitalLocations: HospitalLocation[] = [];

  readonly notificationService = inject(BedOccupancyNotificationService);
  protected fieldConfig: FormlyFieldConfig[];

  ngOnInit(): void {
    this.hospitalLocationsSubscription = this.bedOccupancyStorageService.fetchHospitalLocations().subscribe({
      next: (locations: HospitalLocation[]) => {
        this.hospitalLocations = locations;
        //looking for the IK Number
        this.IkNumber = locations[0]?.ik || 'not-provided';
        this.fieldConfig = notifierFacilityBedOccupancyFormConfigFields(this.IkNumber, this.hospitalLocations);
        //retrieve data from storage
        if (this.bedOccupancyStorageService.getLocalStorageBedOccupancyData(this.IkNumber) !== null || undefined) {
          const loadedData = this.bedOccupancyStorageService.getLocalStorageBedOccupancyData(this.IkNumber);
          const notifierFacilityDataFromLocalStorage = {
            ...loadedData,
            address: {
              ...loadedData.address,
              country: 'DE', //DEMIS-1801: overwrite old countryCode from storage
            },
          };
          this.notificationService.patchFormData({ notifierFacility: notifierFacilityDataFromLocalStorage });
        }
      },
      error: error => {
        const errorMessage = this.messageDialogService.extractMessageFromError(error);
        this.messageDialogService.showErrorDialog({
          redirectToHome: true,
          errorTitle: BedOccupancyConstants.ERROR_NO_LOCATIONS_DIALOG,
          errors: [
            {
              text: errorMessage,
            },
          ],
        });
      },
    });
  }
  ngOnDestroy(): void {
    const model = this.notificationService.getModelData().notifierFacility;
    this.bedOccupancyStorageService.setLocalStorageBedOccupancyData(model.facilityInfo?.ikNumber, {
      ...model,
    });
  }

  protected readonly BedOccupancyConstants = BedOccupancyConstants;
}
