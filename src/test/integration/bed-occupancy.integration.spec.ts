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

import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Locator } from 'vitest/browser';
import { page, userEvent } from 'vitest/browser';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BedOccupancyComponent } from 'src/app/bed-occupancy/bed-occupancy.component';
import { NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS, NUMBER_OF_BEDS_SUPPORT_TEXT_FEATURE_FLAG_BED_INPUT_TEXTS } from 'src/app/shared/common-utils';
import { BedOccupancyQuestionClipboard } from 'src/app/bed-occupancy/services/clipboard/clipboard-enums';
import { BedOccupancyStorageService } from 'src/app/shared/services/bed-occupancy-storage.service';
import { NotifierFacilityFormModel } from 'src/app/shared/models/bed-occupancy-form-model';
import { configureIntegrationTestBed, TEST_DATA } from './bed-occupancy.integration-setup';
import { environment } from '../../environments/environment';
import '../../styles.scss';

describe('BedOccupancy with new sidenav Integration and Playwright', () => {
  let fixture: ComponentFixture<BedOccupancyComponent>;
  let root: Locator;

  const parameters = {
    testParameter: [
      { value: '-10', expectedResult: NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS },
      { value: '1234567', expectedResult: NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS },
      { value: '1.5', expectedResult: NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS },
    ],
  };
  const stepHeaders = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('.mat-step-header')) as HTMLElement[];

  beforeEach(async () => {
    environment.bedOccupancyConfig = {
      ...environment.bedOccupancyConfig,
      featureFlags: {
        ...environment.bedOccupancyConfig?.featureFlags,
        FEATURE_FLAG_PORTAL_BED_TEXT: true,
        FEATURE_FLAG_BED_INPUT_TEXTS: true,
      },
    };
    await configureIntegrationTestBed();
    fixture = TestBed.createComponent(BedOccupancyComponent);
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

    await userEvent.fill(root.getByRole('textbox', { name: 'Telefonnummer' }).first(), '0800123456');
    await userEvent.click(root.getByRole('button', { name: 'Telefonnummer hinzufügen' }));
    await userEvent.fill(root.getByRole('textbox', { name: 'Telefonnummer' }).last(), '0800123456');

    await userEvent.fill(root.getByRole('textbox', { name: 'E-Mail-Adresse' }).first(), 'homer@simpson.com');
    await userEvent.click(root.getByRole('button', { name: 'E-Mail-Adresse hinzufügen' }));
    await userEvent.fill(root.getByRole('textbox', { name: 'E-Mail-Adresse' }).last(), 'homer@simpson.com');

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
    const element = fixture.nativeElement.querySelector(inputSelector) as HTMLInputElement;
    expect(element.getAttribute('aria-invalid')).toBe('true');
    await vi.waitFor(() => {
      const descriptions = (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
      expect(descriptions.some(id => document.getElementById(id)?.textContent?.includes(testExpectation))).toBe(true);
    });
    await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeDisabled();
  }

  async function checkDescribingError(expectedResult: string) {
    await fixture.whenStable();
    fixture.detectChanges();
    const formlyErrors = Array.from(fixture.nativeElement.querySelectorAll('mat-error formly-validation-message')) as HTMLElement[];
    expect(formlyErrors.length, 'formly error should be present').toBeGreaterThan(0);
    expect(formlyErrors.some(error => error.textContent?.includes(expectedResult))).toBe(true);
  }

  function checkSidenavStep(stepHeaders: () => HTMLElement[]) {
    const [step1, step2] = stepHeaders();
    expect(step1.getAttribute('aria-label')).toContain('aktuell');
    expect(step2.getAttribute('aria-label')).toContain('noch nicht begonnen');

    const step1Icon = step1.querySelector('.mat-step-icon');
    expect(step1Icon?.querySelector('.step-number')?.textContent?.trim()).toBe('1');
    expect(step1Icon?.querySelector('.step-valid')).toBeNull();
    return step2;
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('Main form functionality', () => {
    it('excludes the visually concealed honeypot from accessible controls without disabling it', async () => {
      const honeypot = fixture.nativeElement.querySelector('#oneTimeCode') as HTMLInputElement;
      const service = fixture.componentInstance.bedOccupancyNotificationService;
      const control = service.notifierFacilityGroup.get('oneTimeCode');

      expect(honeypot).not.toBeNull();
      expect(getComputedStyle(honeypot.closest('.oneTimeCode')!).opacity).toBe('0');
      expect(getComputedStyle(honeypot).visibility).toBe('visible');
      expect(honeypot.getAttribute('aria-hidden')).toBe('true');
      expect(honeypot.tabIndex).toBe(-1);
      expect(honeypot.disabled).toBe(false);
      await expect.element(root.getByRole('textbox', { name: 'One Time Code' })).not.toBeInTheDocument();
      expect(control).not.toBeNull();
      expect(control?.enabled).toBe(true);
      expect(control?.value ?? '').toBe('');

      const lastname = fixture.nativeElement.querySelector('#lastname') as HTMLInputElement;
      await userEvent.click(bedLocator('#lastname'));
      expect(document.activeElement).toBe(lastname);
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#phoneNo-0'));
    });

    it('keeps DOM-entered honeypot data in the submission model while excluding it after blur', async () => {
      const service = fixture.componentInstance.bedOccupancyNotificationService;

      await userEvent.fill(bedLocator('#oneTimeCode'), 'honeypot-probe');
      await blurActiveElement();
      fixture.detectChanges();

      expect(service.getFormData().notifierFacility.oneTimeCode).toBe('honeypot-probe');
      expect(service.getModelData().notifierFacility.oneTimeCode).toBe('honeypot-probe');
      await expect.element(root.getByRole('textbox', { name: 'One Time Code' })).not.toBeInTheDocument();
    });

    it('should not send, when nothing is inserted', async () => {
      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeDisabled();
    });

    it('should have a validation error when nothing is inserted and someone blurs from an input', async () => {
      const firstname = root.getByLabelText('Vorname');
      await userEvent.fill(firstname, '');
      await blurActiveElement(); // Do not forget to blur the input! Otherwise the validation error will not be triggered in the material form field

      await checkDescribingError('Diese Angabe wird benötigt');
      const [step1] = stepHeaders();
      const step1Icon = step1.querySelector('.mat-step-icon');
      expect(step1Icon?.querySelector('.step-invalid')).not.toBeNull();
    });

    it('shows step numbers on initial load', async () => {
      const step2 = checkSidenavStep(stepHeaders);

      const step2Icon = step2.querySelector('.mat-step-icon');
      expect(step2Icon?.querySelector('.step-number')?.textContent?.trim()).toBe('2');
      expect(step2Icon?.querySelector('.step-valid')).toBeNull();
    });

    it('should send, when form is filled correctly', async () => {
      // Form page 1
      await selectInstitution(TEST_DATA.hospitalLocation.label);
      await userEvent.fill(root.getByLabelText('Vorname'), 'Homer');
      await userEvent.fill(root.getByLabelText('Nachname'), 'Simpson');
      await userEvent.fill(root.getByRole('textbox', { name: 'Telefonnummer' }).first(), '0800123456');
      await userEvent.fill(root.getByRole('textbox', { name: 'E-Mail-Adresse' }).first(), 'homer@simpson.com');
      await userEvent.click(root.getByRole('button', { name: 'Weiter' }));
      const [step1] = stepHeaders();
      const step1Icon = step1.querySelector('.mat-step-icon');
      expect(step1Icon?.querySelector('.step-valid')).not.toBeNull();

      // Form page 2
      await userEvent.fill(bedLocator('#occupied-beds-adults-number-of-beds'), '10');
      await userEvent.fill(bedLocator('#occupied-beds-children-number-of-beds'), '5');

      const step2Icon = step1.querySelector('.mat-step-icon');
      expect(step2Icon?.querySelector('.step-valid')).not.toBeNull();

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
  });

  describe('Validation of occupied and available beds', () => {
    it.each(['mouse', 'keyboard'])('focuses headings on both step directions using %s activation', async activation => {
      await setupFormPage1();
      await vi.waitFor(() => expect(document.activeElement).toBe(fixture.nativeElement.querySelector('main h1')));
      expect((document.activeElement as HTMLElement).tabIndex).toBe(-1);
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#occupied-beds-adults-number-of-beds'));

      const back = root.getByRole('button', { name: 'Zurück' });
      if (activation === 'keyboard') {
        back.element().focus();
        await userEvent.keyboard('{Enter}');
      } else {
        await userEvent.click(back);
      }
      await fixture.whenStable();
      fixture.detectChanges();
      await vi.waitFor(() => {
        const heading = fixture.nativeElement.querySelector('main h1') as HTMLElement;
        expect(heading.textContent).toContain('Meldende Einrichtung');
        expect(document.activeElement).toBe(heading);
      });

      const next = root.getByRole('button', { name: 'Weiter' });
      if (activation === 'keyboard') {
        next.element().focus();
        await userEvent.keyboard('{Enter}');
      } else {
        await userEvent.click(next);
      }
      await vi.waitFor(() => {
        const heading = fixture.nativeElement.querySelector('main h1') as HTMLElement;
        expect(heading.textContent).toContain('Bettenbelegung');
        expect(document.activeElement).toBe(heading);
      });
    });

    it.each([
      'occupied-beds-adults-number-of-beds',
      'occupied-beds-children-number-of-beds',
      'operable-beds-adults-number-of-beds',
      'operable-beds-children-number-of-beds',
    ])('renders reporting-time hint statically and only associates numeric help with %s', async fieldId => {
      await setupFormPage1();
      const reportingTimeHint =
        'Für die Meldung ist der Bettenbelegungsstand des Vortages um 12:00 Uhr maßgeblich; die Übermittlung hat täglich bis 11:00 Uhr zu erfolgen.';
      await expect.element(root.getByText(reportingTimeHint)).toBeVisible();
      const timeHint = fixture.nativeElement.querySelector('.info-notification-text .message p:last-child') as HTMLParagraphElement;
      expect(timeHint?.textContent?.trim()).toBe(reportingTimeHint);
      const input = fixture.nativeElement.querySelector(`#${fieldId}`) as HTMLInputElement;
      await userEvent.click(bedLocator(`#${fieldId}`));

      await vi.waitFor(() => {
        const descriptions = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
        expect(descriptions.some(id => document.getElementById(id)?.textContent?.trim() === reportingTimeHint)).toBe(false);
        expect(descriptions.some(id => document.getElementById(id)?.textContent?.trim() === NUMBER_OF_BEDS_SUPPORT_TEXT_FEATURE_FLAG_BED_INPUT_TEXTS)).toBe(
          true
        );
      });
    });

    it('accepts zero and the upper bound while keeping optional empty fields valid', async () => {
      await setupFormPage1();
      await userEvent.fill(bedLocator('#occupied-beds-adults-number-of-beds'), '0');
      await userEvent.fill(bedLocator('#occupied-beds-children-number-of-beds'), '999999');
      await userEvent.fill(bedLocator('#operable-beds-adults-number-of-beds'), '');
      await userEvent.fill(bedLocator('#operable-beds-children-number-of-beds'), '');
      await blurActiveElement();

      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeEnabled();
      expect(fixture.componentInstance.bedOccupancyNotificationService.bedOccupancyQuestionGroup.valid).toBe(true);
    });

    it('should render supporting text for all bed number fields on page 2', async () => {
      await setupFormPage1();
      await fixture.whenStable();
      fixture.detectChanges();

      const supportTexts = Array.from(fixture.nativeElement.querySelectorAll('mat-hint')) as HTMLElement[];
      const bedSupportTexts = supportTexts.filter(hint => hint.textContent?.trim() === NUMBER_OF_BEDS_SUPPORT_TEXT_FEATURE_FLAG_BED_INPUT_TEXTS);

      expect(bedSupportTexts).toHaveLength(4);
    });

    it.each([false, true])('imports invalid bed values for field validation with FEATURE_FLAG_BED_INPUT_TEXTS=%s', async inputTexts => {
      environment.bedOccupancyConfig.featureFlags.FEATURE_FLAG_BED_INPUT_TEXTS = inputTexts;
      await setupFormPage1();
      const result = fixture.componentInstance.importClipboardData(
        new Map([
          [BedOccupancyQuestionClipboard.ADULTS_OCCUPIED, 'invalid'],
          [BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED, '-12'],
          [BedOccupancyQuestionClipboard.ADULTS_OPERABLE, '1.5'],
          [BedOccupancyQuestionClipboard.CHILDREN_OPERABLE, '1000000'],
        ])
      );
      expect(result).toBe('success');
      await fixture.whenStable();
      fixture.detectChanges();
      const group = fixture.componentInstance.bedOccupancyNotificationService.bedOccupancyQuestionGroup;
      expect(group.getRawValue()).toEqual({
        occupiedBeds: { adultsNumberOfBeds: undefined, childrenNumberOfBeds: -12 },
        operableBeds: { adultsNumberOfBeds: 1.5, childrenNumberOfBeds: 1000000 },
      });
      for (const controlPath of [
        'occupiedBeds.adultsNumberOfBeds',
        'occupiedBeds.childrenNumberOfBeds',
        'operableBeds.adultsNumberOfBeds',
        'operableBeds.childrenNumberOfBeds',
      ]) {
        expect(group.get(controlPath)?.invalid).toBe(true);
      }
      await expect.element(root.getByRole('button', { name: 'Abschicken' })).toBeDisabled();
    });

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

  describe('Side navigation validation state after loading from localStorage', () => {
    const localStorageDataWithEmailOnly: NotifierFacilityFormModel = {
      locationID: String(TEST_DATA.hospitalLocation.id),
      facilityInfo: {
        ikNumber: TEST_DATA.hospitalLocation.ik,
        institutionName: TEST_DATA.hospitalLocation.label,
      },
      address: {
        zip: TEST_DATA.hospitalLocation.postalCode,
        street: TEST_DATA.hospitalLocation.line,
        houseNumber: TEST_DATA.hospitalLocation.houseNumber,
        city: TEST_DATA.hospitalLocation.city,
        country: 'DE',
      },
      contact: {
        salutation: 'Mrs',
        firstname: 'Melderina',
        lastname: 'Melderson',
      },
      contacts: {
        phoneNumbers: [],
        emailAddresses: [{ contactType: 'email', value: 'melderina@melderson.de' }],
      },
    };

    async function recreateFixtureWithStoredData(data: NotifierFacilityFormModel): Promise<void> {
      const storageMock = TestBed.inject(BedOccupancyStorageService) as unknown as {
        getLocalStorageBedOccupancyData: Mock;
      };
      storageMock.getLocalStorageBedOccupancyData.mockReturnValue(data);

      fixture.destroy();
      fixture = TestBed.createComponent(BedOccupancyComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      root = page.elementLocator(fixture.nativeElement);
    }

    it('shows step number "1" on initial load even when the prefilled data is already valid', async () => {
      await recreateFixtureWithStoredData(localStorageDataWithEmailOnly);

      checkSidenavStep(stepHeaders);
    });

    it('marks step 1 as completed with a checkmark after navigating to step 2 via the side navigation', async () => {
      await recreateFixtureWithStoredData(localStorageDataWithEmailOnly);

      await userEvent.click(stepHeaders()[1]);
      await fixture.whenStable();
      fixture.detectChanges();

      const [step1, step2] = stepHeaders();
      expect(step1.getAttribute('aria-label')).toContain('abgeschlossen');
      expect(step2.getAttribute('aria-label')).toContain('aktuell');

      // Step 1 is no longer the current step and its control is now touched + valid,
      // so the stepper renders the "done" checkmark instead of the number.
      const step1Icon = step1.querySelector('.mat-step-icon');
      expect(step1Icon?.querySelector('.step-valid')).not.toBeNull();
    });
  });
});
