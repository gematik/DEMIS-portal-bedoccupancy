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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeepMergeService {
  /**
   * Deep merge two objects, preserving nested properties.
   * Arrays are replaced, not merged.
   * Empty objects in source don't override existing nested objects in target.
   */
  deepMerge<T>(target: T, source: Partial<T>): T {
    if (!target) {
      return source as T;
    }
    if (!source) {
      return target;
    }
    const result = { ...target };
    for (const key in source) {
      if (!Object.hasOwn(source, key)) continue;
      const sourceValue = source[key];
      const targetValue = result[key];
      if (this.shouldSkipSourceValue(sourceValue)) continue;
      if (this.isEmptyObjectOverride(sourceValue, targetValue)) continue;
      if (this.shouldMergeRecursively(sourceValue, targetValue)) {
        result[key] = this.deepMerge(targetValue, sourceValue as any);
      } else {
        result[key] = sourceValue as any;
      }
    }
    return result;
  }

  private shouldSkipSourceValue(value: any): boolean {
    return value === undefined;
  }

  private isEmptyObjectOverride(sourceValue: any, targetValue: any): boolean {
    return (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      Object.keys(sourceValue).length === 0 &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue) &&
      Object.keys(targetValue).length > 0
    );
  }

  private shouldMergeRecursively(sourceValue: any, targetValue: any): boolean {
    return (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    );
  }
}
