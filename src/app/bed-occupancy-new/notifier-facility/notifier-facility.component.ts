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
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BedOccupancyNotificationService } from '../bed-occupancy-notification.service';
import { HospitalLocation } from '../../shared/models/hospital-location';
import { notifierFacilityBedOccupancyFormConfigFields } from '../../shared/formly/configs/bed-occupancy/notifier-facility.config';
import { BedOccupancyStorageService } from '../../shared/services/bed-occupancy-storage.service';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { BedOccupancyConstants } from '../../bed-occupancy/common/bed-occupancy-constants';
import { environment } from 'src/environments/environment';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-notifier-facility',
  imports: [FormlyForm, MatButton, MatIcon, MatToolbar, MatToolbarRow, SectionHeaderComponent, MaxHeightContentContainerComponent, NgTemplateOutlet],
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
  protected fieldConfig: FormlyFieldConfig[] = notifierFacilityBedOccupancyFormConfigFields('', []);

  private readonly unsubscriber = new Subject<void>();

  get isPortalBedOccupancySidenavEnabled() {
    return environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV;
  }

  ngOnInit(): void {
    this.hospitalLocationsSubscription = this.bedOccupancyStorageService
      .fetchHospitalLocations()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: (locations: HospitalLocation[]) => {
          this.hospitalLocations = locations;
          // looking for the IK Number
          this.IkNumber = locations[0]?.ik || 'not-provided';
          this.fieldConfig = notifierFacilityBedOccupancyFormConfigFields(this.IkNumber, this.hospitalLocations);
          //retrieve data from storage
          const localStorageData = this.bedOccupancyStorageService.getLocalStorageBedOccupancyData(this.IkNumber);
          if (localStorageData !== null && localStorageData !== undefined) {
            const loadedData = localStorageData;
            const notifierFacilityDataFromLocalStorage = {
              ...loadedData,
              address: {
                ...loadedData.address,
                country: 'DE', //DEMIS-1801: overwrite old countryCode from storage
              },
            };
            this.notificationService.patchFormData({ notifierFacility: notifierFacilityDataFromLocalStorage }, { markAsTouched: false });
          } else {
            // The FormGroup is pre-built in the service with an empty IK,we need to patch the real IK
            this.notificationService.patchFormData({ notifierFacility: { facilityInfo: { ikNumber: this.IkNumber } } }, { markAsTouched: false });
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
    this.unsubscriber.next();
    this.unsubscriber.complete();

    // store notifierFacility in localstorage when leaving step 1
    const model = this.notificationService.getModelData().notifierFacility;
    this.bedOccupancyStorageService.setLocalStorageBedOccupancyData(model.facilityInfo?.ikNumber, {
      ...model,
    });
  }

  protected readonly BedOccupancyConstants = BedOccupancyConstants;
}
