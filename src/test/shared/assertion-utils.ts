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



import { MockedComponentFixture } from 'ng-mocks';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';

export async function checkDescribingError(options: {
  fixture: MockedComponentFixture;
  element: MatFormFieldControlHarness;
  expectedResult: string;
}): Promise<void> {
  options.fixture.detectChanges();
  await options.fixture.whenStable();
  const describedby = await (await options.element.host()).getAttribute('aria-describedby');
  expect(describedby).withContext('input should have a describedby attribute').toBeTruthy();
  const errorElement = options.fixture.nativeElement.querySelector(`mat-error#${describedby}`);
  expect(errorElement).withContext('error element should be present').toBeTruthy();
  const formlyError = errorElement.querySelector('formly-validation-message');
  expect(formlyError).withContext('formly error should be present').toBeTruthy();
  expect(formlyError.textContent).toContain(options.expectedResult);
}
