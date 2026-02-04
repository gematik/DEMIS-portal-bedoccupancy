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

import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewEncapsulation, input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-side-navigation-stepper',
  templateUrl: './side-navigation-stepper.component.html',
  styleUrls: ['./side-navigation-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SideNavigationStepperComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly steps = input<FormlyFieldConfig[]>([]);
  readonly currentStep = input<number>(undefined);

  isTouchedAndValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }
    return field.fieldGroup ? field.fieldGroup.every(f => this.isTouchedAndValid(f)) : true;
  }

  onStepChange(event: StepperSelectionEvent) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      fragment: this.steps()[event.selectedIndex].props['anchor'],
    });
  }
}
