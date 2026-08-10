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

import { MockedComponentFixture } from 'ng-mocks';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';

export async function checkDescribingError(options: {
  fixture: MockedComponentFixture;
  element: MatFormFieldControlHarness;
  expectedResult: string;
}): Promise<void> {
  options.fixture.detectChanges();
  await options.fixture.whenStable();
  const formlyErrors = Array.from(options.fixture.nativeElement.querySelectorAll('mat-error formly-validation-message')) as HTMLElement[];
  expect(formlyErrors.length, 'formly error should be present').toBeGreaterThan(0);
  expect(formlyErrors.some(error => error.textContent?.includes(options.expectedResult))).toBe(true);
}
