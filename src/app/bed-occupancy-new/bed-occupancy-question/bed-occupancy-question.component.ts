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

import { Component, inject } from '@angular/core';
import { MaxHeightContentContainerComponent, SectionHeaderComponent, StepContentComponent, StepNavigation } from '@gematik/demis-portal-core-library';
import { FormlyForm } from '@ngx-formly/core';
import { BedOccupancyNotificationService } from '../bed-occupancy-notification.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { BedOccupancyConstants } from '../../bed-occupancy/common/bed-occupancy-constants';
import { questionBedOccupancyHtmlConfigFieldsNew } from '../../shared/formly/configs/bed-occupancy/question-new.config';
import { environment } from 'src/environments/environment';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-bed-occupancy-question',
  imports: [FormlyForm, MatButton, MatIcon, MatToolbar, MatToolbarRow, SectionHeaderComponent, MaxHeightContentContainerComponent, NgTemplateOutlet],
  templateUrl: './bed-occupancy-question.component.html',
  styleUrl: './bed-occupancy-question.component.scss',
})
export class BedOccupancyQuestionComponent extends StepContentComponent<void> {
  protected readonly notificationService = inject(BedOccupancyNotificationService);
  protected readonly fieldConfig = questionBedOccupancyHtmlConfigFieldsNew;
  protected navigation = inject(StepNavigation);
  protected readonly BedOccupancyConstants = BedOccupancyConstants;

  get isPortalBedOccupancySidenavEnabled() {
    return environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV;
  }
}
