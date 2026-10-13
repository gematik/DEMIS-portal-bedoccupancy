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
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { GemDemisAriaDisabledButtonDirective, SectionHeaderComponent, StepContentComponent, StepNavigation } from '@gematik/demis-portal-core-library';
import { FormlyForm } from '@ngx-formly/core';
import { questionBedOccupancyHtmlConfigFields } from '../../shared/formly/configs/bed-occupancy/question.config';
import { BedOccupancyConstants } from '../common/bed-occupancy-constants';
import { BedOccupancyNotificationService } from '../services/bed-occupancy-notification.service';

@Component({
  selector: 'app-bed-occupancy-question',
  imports: [FormlyForm, MatButton, MatIcon, SectionHeaderComponent, GemDemisAriaDisabledButtonDirective, ReactiveFormsModule],
  templateUrl: './bed-occupancy-question.component.html',
})
export class BedOccupancyQuestionComponent extends StepContentComponent<void> {
  protected readonly notificationService = inject(BedOccupancyNotificationService);
  protected readonly fieldConfig = questionBedOccupancyHtmlConfigFields();
  protected readonly BedOccupancyConstants = BedOccupancyConstants;
  protected navigation = inject(StepNavigation);
}
