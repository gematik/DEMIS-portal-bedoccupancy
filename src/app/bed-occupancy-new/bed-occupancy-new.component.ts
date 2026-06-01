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

import { Component, computed, inject } from '@angular/core';
import {
  createStepContent,
  MaxHeightContentContainerComponent,
  PasteBoxComponent,
  provideStepNavigation,
  SideNavigationComponent,
} from '@gematik/demis-portal-core-library';
import { BedOccupancyNotificationService } from './bed-occupancy-notification.service';
import { NotifierFacilityComponent } from './notifier-facility/notifier-facility.component';
import { BedOccupancyQuestionComponent } from './bed-occupancy-question/bed-occupancy-question.component';
import { getStepData } from './step-data';
import { BedOccupancyClipboardDataService } from '../bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { HexhexbuttonComponent } from '../shared/components/hexhexbutton/hexhexbutton.component';
import { bedOccupancyDummyData } from '../bed-occupancy/common/dummyData';
import { FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-bed-occupancy-new',
  imports: [MaxHeightContentContainerComponent, SideNavigationComponent, PasteBoxComponent, HexhexbuttonComponent, FormlyModule],
  providers: [provideStepNavigation()],
  templateUrl: './bed-occupancy-new.component.html',
  styleUrl: './bed-occupancy-new.component.scss',
})
export class BedOccupancyNewComponent {
  readonly bedOccupancyNotificationService = inject(BedOccupancyNotificationService);
  readonly bedOccupancyClipboardDataService = inject(BedOccupancyClipboardDataService);

  private readonly stepContents = computed(() => [
    createStepContent({ component: NotifierFacilityComponent }),
    createStepContent({ component: BedOccupancyQuestionComponent }),
  ]);

  /**
   * Maps process steps to their corresponding content components
   */
  public readonly stepsMap = computed(() => {
    return new Map(getStepData(this.bedOccupancyNotificationService).map((step, index) => [step, this.stepContents()[index]]));
  });

  onClipboardDataPasted(clipboardData: Map<string, string>) {
    const data = this.bedOccupancyClipboardDataService.getBedOccupancyQuestionFromClipBoard(clipboardData);
    this.bedOccupancyNotificationService.patchFormData({ bedOccupancyQuestion: data });
    this.bedOccupancyNotificationService.markBedOccupancyQuestionAsVisited();
  }

  handleHexHexChange() {
    this.bedOccupancyNotificationService.patchFormData({
      notifierFacility: bedOccupancyDummyData.notifierFacility,
      bedOccupancyQuestion: bedOccupancyDummyData.bedOccupancyQuestion,
    });
  }
}
