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

import { beforeEach, describe, expect, it } from 'vitest';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BedOccupancyNewComponent } from 'src/app/bed-occupancy-new/bed-occupancy-new.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { getButton, getInput, getSelect, selectOption } from '../shared/material-harness-utils';
import { getHtmlButtonElement } from '../shared/html-element-utils';
import { configureIntegrationTestBed, TEST_DATA } from './bed-occupancy.integration-setup';

// TODO: We've decided to go with Playwright. We need to determine whether these tests can be permanently removed.
describe.skip('BedOccupancy with new sidenav Integration and Playwright', () => {
  let fixture: ComponentFixture<BedOccupancyNewComponent>;
  let loader: HarnessLoader;

  const parameters = {
    testParameter: [
      { value: '-10', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
      { value: '1234567', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
    ],
  };

  beforeEach(async () => {
    await configureIntegrationTestBed();
    fixture = TestBed.createComponent(BedOccupancyNewComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  // Improved page setup functions
  async function setupFormPage1() {
    // Get form controls
    const institutionNameSelect = await getSelect(loader, '#institutionName');
    const firstnameInput = await getInput(loader, '#firstname');
    const lastnameInput = await getInput(loader, '#lastname');

    // Fill in form data
    await selectOption(institutionNameSelect, TEST_DATA.hospitalLocation.label);
    await firstnameInput.setValue('Homer');
    await lastnameInput.setValue('Simpson');

    // Add phone number
    await (await getButton(loader, '#phoneNumbers-add-button')).click();
    const phoneNoInput = await getInput(loader, '[id*="phoneNo"]');
    await phoneNoInput.setValue('0800123456');

    // Add email
    await (await getButton(loader, '#emailAddresses-add-button')).click();
    const emailInput = await getInput(loader, '[id*="email"]');
    await emailInput.setValue('homer@simpson.com');

    // Navigate to next page
    const nextButton = getHtmlButtonElement(fixture.nativeElement, '#btn-nav-action-next');
    nextButton.click();
  }

  async function setupPage2() {
    // Wait for page to be fully loaded

    // Fill in form data sequentially with proper waits
    const occupiedBedsAdultsInput = await getInput(loader, '#occupied-beds-adults-number-of-beds');
    await occupiedBedsAdultsInput.setValue('33');

    const occupiedBedsChildrenInput = await getInput(loader, '#occupied-beds-children-number-of-beds');
    await occupiedBedsChildrenInput.setValue('5');

    const operableBedsAdultsInput = await getInput(loader, '#operable-beds-adults-number-of-beds');
    await operableBedsAdultsInput.setValue('55');

    const operableBedsChildrenInput = await getInput(loader, '#operable-beds-children-number-of-beds');
    await operableBedsChildrenInput.setValue('66');
  }

  // Helper function for testing input validation
  async function testInputValidation(inputSelector: string, testValue: string, testExpectation: string) {
    await setupFormPage1();
    await setupPage2();

    // Get the input, set value and trigger validation
    const inputElement = await getInput(loader, inputSelector);
    await inputElement.setValue(testValue);
    await inputElement.blur();

    await checkDescribingError(inputElement, testExpectation);
    // Verify submit button is disabled when validation fails
    const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');
    expect(submitButton.disabled, `Submit button should be disabled for value: ${testValue}`).toBe(true);
  }

  async function checkDescribingError(_input: MatInputHarness, expectedResult: String) {
    await fixture.whenStable();
    fixture.detectChanges();
    const formlyErrors = Array.from(fixture.nativeElement.querySelectorAll('mat-error formly-validation-message')) as HTMLElement[];
    expect(formlyErrors.length, 'formly error should be present').toBeGreaterThan(0);
    expect(formlyErrors.some(error => error.textContent?.includes(expectedResult.toString()))).toBe(true);
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('Main form functionality', () => {
    it('should not send, when nothing is inserted', async () => {
      const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');
      expect(submitButton).toBeTruthy();
      expect(submitButton.disabled).toBe(true);
    });

    it('should have a validation error when nothing is inserted and someone blurs from an input', async () => {
      // get the input and set some invalid value
      const firstnameInput = await getInput(loader, '#firstname');
      await firstnameInput.setValue('');
      await firstnameInput.blur(); // Do not forget to blur the input! Otherwise the validation error will not be triggered in the material form field

      // check if the error is displayed
      await checkDescribingError(firstnameInput, 'Diese Angabe wird benötigt');
    });

    it('should send, when form is filled correctly', async () => {
      // Form page 1
      const institutionNameSelect = await getSelect(loader, '#institutionName');
      const firstnameInput = await getInput(loader, '#firstname');
      const lastnameInput = await getInput(loader, '#lastname');
      const phoneNoInput = await getInput(loader, '[id*="phoneNo"]');
      const emailInput = await getInput(loader, '[id*="email"]');
      const nextButton = getHtmlButtonElement(fixture.nativeElement, '#btn-nav-action-next');

      await selectOption(institutionNameSelect, TEST_DATA.hospitalLocation.label);
      await firstnameInput.setValue('Homer');
      await lastnameInput.setValue('Simpson');
      await phoneNoInput.setValue('0800123456');
      await emailInput.setValue('homer@simpson.com');
      await nextButton.click();

      // Form page 2
      const occupiedBedsAdultsInput = await getInput(loader, '#occupied-beds-adults-number-of-beds');
      const occupiedBedsChildrenInput = await getInput(loader, '#occupied-beds-children-number-of-beds');

      await occupiedBedsAdultsInput.setValue('10');
      await occupiedBedsChildrenInput.setValue('5');

      const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');

      expect(await submitButton.disabled).toBe(false);
    });

    it('should not send, when nothing is inserted', async () => {
      const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');
      expect(submitButton).toBeTruthy();
      expect(submitButton.disabled).toBe(true);
    });

    it('should have a validation error when nothing is inserted and someone blurs from an input', async () => {
      // get the input and set some invalid value
      const firstnameInput = await getInput(loader, '#firstname');
      await firstnameInput.setValue('');
      await firstnameInput.blur(); // Do not forget to blur the input! Otherwise the validation error will not be triggered in the material form field

      // check if the error is displayed
      await checkDescribingError(firstnameInput, 'Diese Angabe wird benötigt');
    });

    it('should send, when form is filled correctly', async () => {
      // Form page 1
      const institutionNameSelect = await getSelect(loader, '#institutionName');
      const firstnameInput = await getInput(loader, '#firstname');
      const lastnameInput = await getInput(loader, '#lastname');
      const phoneNoInput = await getInput(loader, '[id*="phoneNo"]');
      const emailInput = await getInput(loader, '[id*="email"]');
      const nextButton = getHtmlButtonElement(fixture.nativeElement, '#btn-nav-action-next');

      await selectOption(institutionNameSelect, TEST_DATA.hospitalLocation.label);
      await firstnameInput.setValue('Homer');
      await lastnameInput.setValue('Simpson');
      await phoneNoInput.setValue('0800123456');
      await emailInput.setValue('homer@simpson.com');
      await nextButton.click();

      // Form page 2
      const occupiedBedsAdultsInput = await getInput(loader, '#occupied-beds-adults-number-of-beds');
      const occupiedBedsChildrenInput = await getInput(loader, '#occupied-beds-children-number-of-beds');

      await occupiedBedsAdultsInput.setValue('10');
      await occupiedBedsChildrenInput.setValue('5');

      const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');

      expect(await submitButton.disabled).toBe(false);
    });
  });

  describe('Validation of email and phone number', () => {
    const validationParameters = {
      email: [
        { value: 'auch-ungueltig.de', expectedResult: 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)' },
        { value: '_@test_Me.too', expectedResult: 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)' },
        {
          value: 'keinesonderzeichen´êa@ü?.djkd',
          expectedResult: 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)',
        },
        {
          value:
            'genau321Zeichen_nach_dem@Lorem-ipsum-dolor-sit-amet--consetetur-sadipscing-elitr--sed-diam-nonumy-eirmod-tempor-invidunt-ut-labore-et-dolore-magna-aliquyam-erat--sed-diam-voluptua.-At-vero-eos-et-accusam-et-justo-duo-dolores-et-ea-rebum.-Stet-clita-kasd-gubergren--no-sea-takimata-sanctus-est-Lorem-ipsum-dolor-sit-amet.-Lorem-ipsum-dolor-sit.com',
          expectedResult: 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)',
        },
      ],
      phoneNumber: [
        {
          value: '1741236589',
          expectedResult: 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.',
        },
        {
          value: '01234',
          expectedResult: 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.',
        },
        {
          value: '0123456789abc',
          expectedResult: 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.',
        },
        {
          value: '(0049)1741236589',
          expectedResult: 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.',
        },
      ],
    };
    validationParameters.email.forEach(parameter => {
      it(`for the email, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await (await getButton(loader, '#emailAddresses-add-button')).click();
        const emailInput = await getInput(loader, '[id*="email"]');
        await emailInput.setValue(parameter.value);
        await emailInput.blur();

        await checkDescribingError(emailInput, parameter.expectedResult);
      });
    });
    validationParameters.phoneNumber.forEach(parameter => {
      it(`for the phone number, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await (await getButton(loader, '#phoneNumbers-add-button')).click();
        const phoneNoInput = await getInput(loader, '[id*="phoneNo"]');
        await phoneNoInput.setValue(parameter.value);
        await phoneNoInput.blur();

        await checkDescribingError(phoneNoInput, parameter.expectedResult);
      });
    });
  });

  describe('Validation of occupied and available beds', () => {
    // Refactored tests using the helper function
    describe('should validate occupied adult beds', () => {
      parameters.testParameter.forEach(parameter => {
        it(`rejects invalid value: '${parameter.value}'`, async () => {
          await testInputValidation('#occupied-beds-adults-number-of-beds', parameter.value, parameter.expectedResult);
        });
      });
    });

    describe('should validate occupied children beds', () => {
      parameters.testParameter.forEach(parameter => {
        it(`rejects invalid value: '${parameter.value}'`, async () => {
          await testInputValidation('#occupied-beds-children-number-of-beds', parameter.value, parameter.expectedResult);
        });
      });
    });

    describe('should validate operable adult beds', () => {
      parameters.testParameter.forEach(parameter => {
        it(`rejects invalid value: '${parameter.value}'`, async () => {
          await testInputValidation('#operable-beds-adults-number-of-beds', parameter.value, parameter.expectedResult);
        });
      });
    });

    describe('should validate operable children beds', () => {
      parameters.testParameter.forEach(parameter => {
        it(`rejects invalid value: '${parameter.value}'`, async () => {
          await testInputValidation('#operable-beds-children-number-of-beds', parameter.value, parameter.expectedResult);
        });
      });
    });
  });
});
