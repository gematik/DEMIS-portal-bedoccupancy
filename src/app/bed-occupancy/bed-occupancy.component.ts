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



import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BedOccupancy } from 'src/api/notification';
import { HospitalLocation } from 'src/app/shared/models/hospital-location';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Subscription } from 'rxjs';

import { BedOccupancyConstants } from './common/bed-occupancy-constants';

import { ErrorMessageDialogComponent } from '../shared/dialogs/message-dialog/error-message-dialog.component';
import { notifierFacilityBedOccupancyFormConfigFields } from '../shared/formly/configs/bed-occupancy/notifier-facility.config';
import { questionBedOccupancyHtmlConfigFields } from '../shared/formly/configs/bed-occupancy/question.config';
import { NotificationConstants } from '../shared/notification-constants';
import { BedOccupancyStorageService } from '../shared/services/bed-occupancy-storage.service';
import { FhirBedOccupancyService } from '../shared/services/fhir-bed-occupancy.service';
import { bedOccupancyDummyData } from './common/dummyData';
import { BedOccupancyNotificationFormDefinitionService } from './services/bed-occupancy-notification-form-definition.service';
import { BedOccupancyClipboardDataService } from './services/clipboard/bed-occupancy-clipboard-data.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bed-occupancy',
  templateUrl: './bed-occupancy.component.html',
  styleUrls: ['./bed-occupancy.component.scss'],
})
export class BedOccupancyComponent implements OnInit, OnDestroy {
  hospitalLocations: HospitalLocation[] = [];
  hospitalLocationsSubscription: Subscription | undefined;
  form = new FormGroup({});
  model: any = {
    //this is needed to show the email and phone field on iniital load
    notifierFacility: {
      contacts: {
        phoneNumbers: [
          {
            contactType: 'phone',
            usage: 'work',
            value: '',
          },
        ],
        emailAddresses: [
          {
            contactType: 'email',
            value: '',
          },
        ],
      },
    },
  };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  IkNumber: string;
  bedOccupancyDummyData = bedOccupancyDummyData;

  sendFunction: (bo: BedOccupancy) => void;
  private copyPasteBoxData: Subscription;
  private copyHexHexButtonData: Subscription;

  constructor(
    private bedOccupancyStorageService: BedOccupancyStorageService,
    public dialog: MatDialog,
    private fhirBedOccupancyService: FhirBedOccupancyService,
    private BedOccupancyClipboardDataService: BedOccupancyClipboardDataService,
    private BedOccupancyNotificationFormDefinitionService: BedOccupancyNotificationFormDefinitionService
  ) {
    this.copyPasteBoxData = this.BedOccupancyClipboardDataService.clipboardData$.subscribe(data => {
      this.handlePasteBoxOrHexhexChange(data);
    });

    this.copyHexHexButtonData = this.BedOccupancyNotificationFormDefinitionService.hexhexButtonClick$.subscribe(() => {
      this.handlePasteBoxOrHexhexChange(bedOccupancyDummyData);
    });

    this.sendFunction = bo => this.fhirBedOccupancyService.openSubmitDialog(bo);
  }

  handlePasteBoxOrHexhexChange(data: any) {
    if (data === null) {
      return;
    }
    this.model = { ...this.model, ...data };
    this.markFormGroupTouched(this.form);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  submit() {
    const transformedData = this.fhirBedOccupancyService.transformData(this.model);
    //set data to storage
    this.bedOccupancyStorageService.setLocalStorageBedOccupancyData(this.IkNumber, {
      ...this.model.notifierFacility,
    });
    this.sendFunction(transformedData);
  }

  ngOnInit(): void {
    this.hospitalLocationsSubscription = this.bedOccupancyStorageService.fetchHospitalLocations().subscribe({
      next: (locations: HospitalLocation[]) => {
        this.hospitalLocations = locations;

        //looking for the IK Number
        this.IkNumber = locations[0]?.ik || 'not-provided';
        const notifierFields = notifierFacilityBedOccupancyFormConfigFields(this.IkNumber, this.hospitalLocations);
        this.fields = [
          {
            key: '',
            type: BedOccupancyConstants.DEMIS_FORM_WRAPPER_TEMPLATE_KEYWORD,
            fieldGroup: [
              {
                key: 'notifierFacility',
                props: {
                  title: BedOccupancyConstants.FORM_TITLE,
                  label: BedOccupancyConstants.MELDENDE_EINRICHTUNG,
                  anchor: NotificationConstants.BED_OCCUPANCY_NOTIFIER_FACILITY,
                },
                fieldGroup: notifierFields,
              },
              {
                key: 'bedOccupancyQuestion',
                props: {
                  title: BedOccupancyConstants.FORM_TITLE,
                  label: BedOccupancyConstants.BETTENBELEGUNG,
                  anchor: NotificationConstants.BED_OCCUPANCY_OCCUPIED_BEDS,
                },
                fieldGroup: questionBedOccupancyHtmlConfigFields,
              },
            ],
          },
        ];

        //retrieve data from storage
        if (this.bedOccupancyStorageService.getLocalStorageBedOccupancyData(this.IkNumber) !== null || undefined) {
          const loadedData = this.bedOccupancyStorageService.getLocalStorageBedOccupancyData(this.IkNumber);
          this.model = {
            bedOccupancyQuestion: {},
            notifierFacility: {
              ...loadedData,
              address: {
                ...loadedData.address,
                country: 'DE', //DEMIS-1801: overwrite old countryCode from storage
              },
            },
          };
        }
      },
      error: error => {
        this.dialog.open(
          ErrorMessageDialogComponent,
          ErrorMessageDialogComponent.getErrorDialogCommonData(error, BedOccupancyConstants.ERROR_NO_LOCATIONS_DIALOG)
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.hospitalLocationsSubscription?.unsubscribe();
    this.copyPasteBoxData.unsubscribe();
    this.copyHexHexButtonData.unsubscribe();
  }
}
