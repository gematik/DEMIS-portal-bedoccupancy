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

import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { FormlyFormBuilder } from '@ngx-formly/core';
import { FhirBedOccupancyService } from '../shared/services/fhir-bed-occupancy.service';
import { DeepMergeService } from '@gematik/demis-portal-core-library';
import { notifierFacilityBedOccupancyFormConfigFields } from '../shared/formly/configs/bed-occupancy/notifier-facility.config';
import { questionBedOccupancyHtmlConfigFieldsNew } from '../shared/formly/configs/bed-occupancy/question-new.config';
import { BedOccupancyFormModel, DeepPartial, NotifierFacilityFormModel } from '../shared/models/bed-occupancy-form-model';
import { BedOccupancyQuestion } from 'src/api/notification';

@Injectable({
  providedIn: 'root',
})
export class BedOccupancyNotificationService {
  private readonly fhirBedOccupancyService = inject(FhirBedOccupancyService);
  private readonly deepMergeService = inject(DeepMergeService);
  private readonly formlyBuilder = inject(FormlyFormBuilder);

  /**
   * FormGroups and models for each step.
   * The models are implemented as Signals for reactive updates.
   * The models are used by Formly to initialize the FormControls.
   *
   * Both FormGroups are pre-built via FormlyFormBuilder so that their
   * FormControls (and the real Formly validators) exist from the start,
   * even before the step is actually rendered. This makes `patchFormData`
   * and side-navigation validity indicators work correctly for every step
   * regardless of whether the user has visited it yet.
   *
   * The notifierFacility config is built with an empty hospital-locations
   * list initially; the concrete options are provided later by
   * NotifierFacilityComponent once the async HTTP call resolves. Formly's
   * `addControl` is idempotent, so re-rendering with the final config only
   * updates dynamic props (e.g. select options) without recreating controls.
   */
  notifierFacilityModel = signal<NotifierFacilityFormModel>({});
  bedOccupancyQuestionModel = signal<DeepPartial<BedOccupancyQuestion>>({});

  notifierFacilityGroup = new FormGroup({});
  bedOccupancyQuestionGroup = new FormGroup({});

  constructor() {
    // Eagerly build both FormGroups so their controls and Formly validators
    // are available before the corresponding step is rendered.
    this.formlyBuilder.buildForm(this.notifierFacilityGroup, notifierFacilityBedOccupancyFormConfigFields('', []), this.notifierFacilityModel(), {});
    this.formlyBuilder.buildForm(this.bedOccupancyQuestionGroup, questionBedOccupancyHtmlConfigFieldsNew(), this.bedOccupancyQuestionModel(), {});
  }

  sendData() {
    const model = this.getModelData();
    const transformedData = this.fhirBedOccupancyService.transformData(model);
    this.fhirBedOccupancyService.submitNotification(transformedData);
  }

  /**
   * Sets or updates form data for one or more steps by deep-merging the
   * provided partial data into the current model and the corresponding
   * FormGroup value.
   *
   * Because both FormGroups are pre-built in the constructor, the controls
   * always exist when this method runs and `patchValue` takes effect
   * immediately.
   *
   * Example:
   * ```
   * bedOccupancyNotificationService.patchFormData({
   *   notifierFacility: { name: 'Hospital XYZ' },
   *   bedOccupancyQuestion: { occupiedBeds: { adultsNumberOfBeds: 10 } }
   * });
   * ```
   */
  patchFormData(data: BedOccupancyFormModel, options: { markAsTouched?: boolean } = {}): void {
    const { markAsTouched = true } = options;
    const stepMappings = [
      { key: 'notifierFacility' as const, model: this.notifierFacilityModel, group: this.notifierFacilityGroup },
      { key: 'bedOccupancyQuestion' as const, model: this.bedOccupancyQuestionModel, group: this.bedOccupancyQuestionGroup },
    ];

    stepMappings.forEach(({ key, model, group }) => {
      if (!data[key]) return;

      const currentData = Object.keys(group.value).length > 0 ? group.value : model();
      const mergedData = this.deepMergeService.deepMerge(currentData, data[key]);

      model.set(mergedData);
      group.patchValue(mergedData);
      this.syncFormArrayLengths(group, mergedData);
      this.updateStepValidation(group, markAsTouched);
    });
  }

  /**
   * `FormGroup.patchValue` never adds or removes entries from a `FormArray`.
   * When merged data contains a shorter array than the current control
   * (typically because Formly seeded it with a `defaultValue: [{}]` empty
   * placeholder), the excess controls stay behind with their required inner
   * validators and keep the FormGroup invalid. This walks the control tree
   * and truncates each FormArray to match the merged data length.
   */
  private syncFormArrayLengths(control: AbstractControl, data: unknown): void {
    if (control instanceof FormArray) {
      const dataArray = Array.isArray(data) ? data : [];
      while (control.length > dataArray.length) {
        control.removeAt(control.length - 1);
      }
      control.controls.forEach((child, index) => this.syncFormArrayLengths(child, dataArray[index]));
      return;
    }
    if (control instanceof FormGroup) {
      const dataObject = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
      Object.keys(control.controls).forEach(key => this.syncFormArrayLengths(control.controls[key], dataObject[key]));
    }
  }

  /**
   * Helper method to trigger validation updates and statusChanges emission.
   *
   * When `markAsTouched` is false the FormGroup is explicitly reset to
   * `untouched`. `patchValue`, `FormArray.removeAt` and the FormlyForm's
   * initial rendering can otherwise leave residual touched state behind
   * (e.g. from a previous visit whose leaving triggered `markAllAsTouched`
   * in the process stepper). Untouching here guarantees that after a
   * programmatic prefill the side navigation shows the step number and
   * not a completed/error indicator until the user actually interacts.
   */
  private updateStepValidation(group: FormGroup, markAsTouched: boolean): void {
    if (markAsTouched) {
      group.markAllAsTouched();
    } else {
      group.markAsUntouched();
    }
    group.updateValueAndValidity({ emitEvent: true });
  }

  /**
   * Returns the current form data as a plain JavaScript object.
   * Uses the FormGroup values (as they contain the current values from the forms).
   */
  getFormData(): BedOccupancyFormModel {
    return {
      notifierFacility: this.notifierFacilityGroup.value,
      bedOccupancyQuestion: this.bedOccupancyQuestionGroup.value,
    };
  }

  /**
   * Returns the current model data as a plain JavaScript object.
   * Uses the Signal values (Models).
   */
  getModelData() {
    return {
      notifierFacility: this.notifierFacilityModel(),
      bedOccupancyQuestion: this.bedOccupancyQuestionModel(),
    };
  }

  /**
   * Checks if all FormGroups are valid and contain data.
   */
  isFormValid(): boolean {
    return this.notifierFacilityGroup.valid && this.bedOccupancyQuestionGroup.valid;
  }

  /**
   * Clears the touched state of both FormGroups. Should be called when the
   * entire wizard route is entered so a fresh visit does not carry over
   * validation state from a previous run within the same session.
   */
  resetVisitedFlags(): void {
    this.notifierFacilityGroup.markAsUntouched();
    this.bedOccupancyQuestionGroup.markAsUntouched();
  }
}
