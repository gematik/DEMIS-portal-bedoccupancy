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



import { Injectable, Injector } from '@angular/core';
import { BedOccupancy } from 'src/api/notification';
import { NotificationConstants } from 'src/app/shared/notification-constants';
import { NotificationFormDefinitionBase } from 'src/app/shared/models/notifications/notification-form-definition-base';
import { StepNode } from 'src/app/shared/tree/tree.component';
import { ValueSets } from 'src/app/shared/models/fhir/value-sets';
import { Subject } from 'rxjs';
import { ValidateBedOccupancyNotificationService } from 'src/app/shared/services/validate-bed-occupancy-notification.service';
import { BedOccupancyConstants } from '../common/bed-occupancy-constants';

@Injectable({
  providedIn: 'root',
})
export class BedOccupancyNotificationFormDefinitionService implements NotificationFormDefinitionBase<BedOccupancy> {
  constructor() {}

  private hexhexButtonClickSubject = new Subject<void>();
  hexhexButtonClick$ = this.hexhexButtonClickSubject.asObservable();

  handleHexHex() {
    this.hexhexButtonClickSubject.next();
  }

  // no valueSets atm, but logic remains for future use.
  valueSets: string[] = [];

  getFormTitle(): string {
    return BedOccupancyConstants.FORM_TITLE;
  }

  getTreeData(notification: BedOccupancy, injector: Injector): StepNode[] {
    const bedOccupancyvalidationService = injector.get(ValidateBedOccupancyNotificationService);

    return [
      {
        name: BedOccupancyConstants.MELDENDE_EINRICHTUNG,
        invalid: !bedOccupancyvalidationService.bedOccupancyNotifierFacility(notification.notifierFacility),
        link: NotificationConstants.BED_OCCUPANCY_NOTIFIER_FACILITY,
      },
      {
        name: BedOccupancyConstants.BETTENBELEGUNG,
        invalid: !bedOccupancyvalidationService.validateBedOccupancyQuestion(notification.bedOccupancyQuestion),
        link: NotificationConstants.BED_OCCUPANCY_OCCUPIED_BEDS,
      },
    ];
  }

  getValueSets(): string[] {
    return this.valueSets;
  }
}
