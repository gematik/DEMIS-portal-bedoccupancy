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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { Locator } from 'vitest/browser';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BedOccupancyNewComponent } from 'src/app/bed-occupancy-new/bed-occupancy-new.component';
import { configureIntegrationTestBed, TEST_DATA } from './bed-occupancy.integration-setup';
import { environment } from '../../environments/environment';

describe('BedOccupancy with new sidenav Integration and Playwright', () => {
  let fixture: ComponentFixture<BedOccupancyNewComponent>;
  let root: Locator;

  const parameters = {
    testParameter: [
      { value: '-10', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
      { value: '1234567', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
    ],
  };

  beforeEach(async () => {
    environment.bedOccupancyConfig = {
      ...environment.bedOccupancyConfig,
      featureFlags: {
        ...environment.bedOccupancyConfig?.featureFlags,
        FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV: true,
      },
    };
    await configureIntegrationTestBed();
    fixture = TestBed.createComponent(BedOccupancyNewComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    root = page.elementLocator(fixture.nativeElement);
  });

  afterEach(() => {
    fixture.destroy();
  });

  const bedLocator = (idSelector: string): Locator => {
    const element = fixture.nativeElement.querySelector(idSelector) as Element | null;
    if (!element) {
      throw new Error(`Element not found for selector: ${idSelector}`);
    }
    return page.elementLocator(element);
  };

  async function selectInstitution(optionText: string) {
    // mat-select has role "combobox"; open it and click the matching option in the CDK overlay
    await userEvent.click(root.getByRole('combobox', { name: 'Name der Einrichtung' }));
    await fixture.whenStable();

    const overlayOption = page.getByRole('option', { name: new RegExp(optionText, 'i') });
    await userEvent.click(overlayOption);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function blurActiveElement() {
    (document.activeElement as HTMLElement | null)?.blur();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function setupFormPage1() {
    await selectInstitution(TEST_DATA.hospitalLocation.label);
    await userEvent.fill(root.getByLabelText('Vorname'), 'Homer');
    await userEvent.fill(root.getByLabelText('Nachname'), 'Simpson');

    await userEvent.click(root.getByRole('button', { name: 'Telefonnummer hinzufügen' }));
    await userEvent.fill(root.getByLabelText('Telefonnummer').last(), '0800123456');

    await userEvent.click(root.getByRole('button', { name: 'Email-Adresse hinzufügen' }));
    await userEvent.fill(root.getByLabelText('Email-Adresse').last(), 'homer@simpson.com');

    await userEvent.click(root.getByRole('button', { name: 'Weiter' }));
  }

  async function setupPage2() {
    await userEvent.fill(bedLocator('#occupied-beds-adults-number-of-beds'), '33');
    await userEvent.fill(bedLocator('#occupied-beds-children-number-of-beds'), '5');
    await userEvent.fill(bedLocator('#operable-beds-adults-number-of-beds'), '55');
    await userEvent.fill(bedLocator('#operable-beds-children-number-of-beds'), '66');
  }

  async function testInputValidation(inputSelector: string, testValue: string, testExpectation: string) {
    await setupFormPage1();
    await setupPage2();

    const input = bedLocator(inputSelector);
    await userEvent.fill(input, testValue);
    await blurActiveElement();

    await checkDescribingError(testExpectation);
    await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeDisabled();
  }

  async function checkDescribingError(expectedResult: string) {
    await fixture.whenStable();
    fixture.detectChanges();
    const formlyErrors = Array.from(fixture.nativeElement.querySelectorAll('mat-error formly-validation-message')) as HTMLElement[];
    expect(formlyErrors.length, 'formly error should be present').toBeGreaterThan(0);
    expect(formlyErrors.some(error => error.textContent?.includes(expectedResult))).toBe(true);
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('Main form functionality', () => {
    it('should not send, when nothing is inserted', async () => {
      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeDisabled();
    });

    it('should have a validation error when nothing is inserted and someone blurs from an input', async () => {
      const firstname = root.getByLabelText('Vorname');
      await userEvent.fill(firstname, '');
      await blurActiveElement(); // Do not forget to blur the input! Otherwise the validation error will not be triggered in the material form field

      await checkDescribingError('Diese Angabe wird benötigt');
    });

    it('should send, when form is filled correctly', async () => {
      // Form page 1
      await selectInstitution(TEST_DATA.hospitalLocation.label);
      await userEvent.fill(root.getByLabelText('Vorname'), 'Homer');
      await userEvent.fill(root.getByLabelText('Nachname'), 'Simpson');
      await userEvent.fill(root.getByLabelText('Telefonnummer').first(), '0800123456');
      await userEvent.fill(root.getByLabelText('Email-Adresse').first(), 'homer@simpson.com');
      await userEvent.click(root.getByRole('button', { name: 'Weiter' }));

      // Form page 2
      await userEvent.fill(bedLocator('#occupied-beds-adults-number-of-beds'), '10');
      await userEvent.fill(bedLocator('#occupied-beds-children-number-of-beds'), '5');

      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeEnabled();
    });

    it('should not send, when nothing is inserted', async () => {
      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeDisabled();
    });

    it('should have a validation error when nothing is inserted and someone blurs from an input', async () => {
      await userEvent.fill(root.getByLabelText('Vorname'), '');
      await blurActiveElement(); // Do not forget to blur the input! Otherwise the validation error will not be triggered in the material form field

      await checkDescribingError('Diese Angabe wird benötigt');
    });

    it('should send, when form is filled correctly', async () => {
      // Form page 1
      await selectInstitution(TEST_DATA.hospitalLocation.label);
      await userEvent.fill(root.getByLabelText('Vorname'), 'Homer');
      await userEvent.fill(root.getByLabelText('Nachname'), 'Simpson');
      await userEvent.fill(root.getByLabelText('Telefonnummer').first(), '0800123456');
      await userEvent.fill(root.getByLabelText('Email-Adresse').first(), 'homer@simpson.com');
      await userEvent.click(root.getByRole('button', { name: 'Weiter' }));

      // Form page 2
      await userEvent.fill(bedLocator('#occupied-beds-adults-number-of-beds'), '10');
      await userEvent.fill(bedLocator('#occupied-beds-children-number-of-beds'), '5');

      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeEnabled();
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
        await userEvent.click(root.getByRole('button', { name: 'Email-Adresse hinzufügen' }));
        await userEvent.fill(root.getByLabelText('Email-Adresse').last(), parameter.value);
        await blurActiveElement();

        await checkDescribingError(parameter.expectedResult);
      });
    });
    validationParameters.phoneNumber.forEach(parameter => {
      it(`for the phone number, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await userEvent.click(root.getByRole('button', { name: 'Telefonnummer hinzufügen' }));
        await userEvent.fill(root.getByLabelText('Telefonnummer').last(), parameter.value);
        await blurActiveElement();

        await checkDescribingError(parameter.expectedResult);
      });
    });
  });

  describe('Validation of occupied and available beds', () => {
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
