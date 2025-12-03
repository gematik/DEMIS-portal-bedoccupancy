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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { Component, inject, input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BedOccupancyNotificationFormDefinitionService } from 'src/app/bed-occupancy/services/bed-occupancy-notification-form-definition.service';
import { BedOccupancyClipboardDataService } from 'src/app/bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-navigation-wrapper',
  templateUrl: './side-navigation-wrapper.component.html',
  styleUrls: ['./side-navigation-wrapper.component.scss'],
  standalone: false,
})
export class SideNavigationWrapperComponent {
  readonly currentStep = input(0);
  readonly maxNumberOfSteps = input(0);
  readonly headline = input('');
  readonly currentStepHeadline = input('');
  readonly steps = input<FormlyFieldConfig[]>(undefined);
  readonly model = input<any>(undefined);

  readonly bedOccupancyClipboardDataService = inject(BedOccupancyClipboardDataService);
  private readonly bedOccupancyNotificationFormDefinitionService = inject(BedOccupancyNotificationFormDefinitionService);

  get FEATURE_FLAG_PORTAL_PASTEBOX() {
    return environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_PASTEBOX ?? false;
  }

  get FEATURE_FLAG_PORTAL_PAGE_STRUCTURE() {
    return environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_PAGE_STRUCTURE ?? false;
  }

  onClipboardDataPasted(clipboardData: Map<string, string>) {
    this.bedOccupancyClipboardDataService.updateBedOccupancy(clipboardData);
  }

  /**
   * @deprecated Use {@link onClipboardDataPasted} instead, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
   */
  handlePasteBoxClick() {
    this.bedOccupancyClipboardDataService.fillBedOccupancyWithClipBoardData();
  }

  handleHexhexButtonClick() {
    this.bedOccupancyNotificationFormDefinitionService.handleHexHex();
  }
}
