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
import { FormGroup } from '@angular/forms';
import { FhirBedOccupancyService } from '../shared/services/fhir-bed-occupancy.service';
import { DeepMergeService } from './deep-merge.service';

@Injectable({
  providedIn: 'root',
})
export class BedOccupancyNotificationService {
  /**
   * FormGroups and models for each step.
   * The models are implemented as Signals for reactive updates.
   * The models are used by Formly to initialize the FormControls.
   */
  notifierFacilityGroup = new FormGroup({});
  notifierFacilityModel = signal<any>({});

  bedOccupancyQuestionGroup = new FormGroup({});
  bedOccupancyQuestionModel = signal<any>({});

  private bedOccupancyQuestionVisited = false;

  private readonly fhirBedOccupancyService = inject(FhirBedOccupancyService);
  private readonly deepMergeService = inject(DeepMergeService);

  sendData() {
    const model = this.getModelData();
    const transformedData = this.fhirBedOccupancyService.transformData(model);
    this.fhirBedOccupancyService.submitNotification(transformedData);
  }

  /**
   * Sets or updates form data for one or more steps.
   * Uses a hybrid approach:
   * - Updates model objects (for not yet rendered steps)
   * - Updates FormGroups via patchValue (for already rendered steps)
   *
   * This ensures that data is correctly applied regardless of whether
   * the step has already been visited/rendered.
   *
   * Example:
   * ```
   * bedOccupancyNotificationService.patchFormData({
   *   notifierFacility: { name: 'Hospital XYZ' },
   *   bedOccupancyQuestion: { occupiedBeds: { adultsNumberOfBeds: 10 } }
   * });
   * ```
   */
  patchFormData(data: { notifierFacility?: any; bedOccupancyQuestion?: any }): void {
    // Mapping between data keys, models and FormGroups
    const stepMappings = [
      { key: 'notifierFacility' as const, model: this.notifierFacilityModel, group: this.notifierFacilityGroup },
      { key: 'bedOccupancyQuestion' as const, model: this.bedOccupancyQuestionModel, group: this.bedOccupancyQuestionGroup },
    ];

    // Phase 1: Update models and FormGroups with new values
    stepMappings.forEach(({ key, model, group }) => {
      if (data[key]) {
        // Get the source for merging: prefer FormGroup value if it has data, otherwise use Model
        const currentData = Object.keys(group.value).length > 0 ? group.value : model();

        // Deep merge existing data with new data
        const mergedData = this.deepMergeService.deepMerge(currentData, data[key]);

        model.set(mergedData); // Update Signal-Model
        group.patchValue(mergedData); // Update FormGroup with merged data
      }
    });

    // Phase 2: Trigger validation and statusChanges events
    stepMappings.forEach(({ key, group }) => {
      if (data[key]) {
        this.updateStepValidation(group);
      }
    });
  }

  /**
   * Helper method to trigger validation updates and statusChanges emission.
   */
  private updateStepValidation(group: FormGroup): void {
    group.markAllAsTouched();
    group.updateValueAndValidity({ emitEvent: true });
  }

  /**
   * Returns the current form data as a plain JavaScript object.
   * Uses the FormGroup values (as they contain the current values from the forms).
   */
  getFormData(): any {
    return {
      notifierFacility: this.notifierFacilityGroup.value,
      bedOccupancyQuestion: this.bedOccupancyQuestionGroup.value,
    };
  }

  /**
   * Returns the current model data as a plain JavaScript object.
   * Uses the Signal values (Models).
   */
  getModelData(): any {
    return {
      notifierFacility: this.notifierFacilityModel(),
      bedOccupancyQuestion: this.bedOccupancyQuestionModel(),
    };
  }

  /**
   * Checks if all FormGroups are valid and contain data.
   */
  isFormValid(): boolean {
    const hasNotifierFacilityData = Object.keys(this.notifierFacilityGroup.value).length > 0;
    const hasBedOccupancyQuestionData = Object.keys(this.bedOccupancyQuestionGroup.value).length > 0;

    return this.notifierFacilityGroup.valid && hasNotifierFacilityData && this.bedOccupancyQuestionGroup.valid && hasBedOccupancyQuestionData;
  }

  /**
   * Checks if the bedOccupancyQuestion step has been visited before.
   */
  hasBedOccupancyQuestionBeenVisited(): boolean {
    return this.bedOccupancyQuestionVisited;
  }

  /**
   * Marks the bedOccupancyQuestion step as visited.
   */
  markBedOccupancyQuestionAsVisited(): void {
    this.bedOccupancyQuestionVisited = true;
  }
}
