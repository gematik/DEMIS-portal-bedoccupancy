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



import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { of } from 'rxjs';
import { BedOccupancyComponent } from 'src/app/bed-occupancy/bed-occupancy.component';
import { BedOccupancyModule } from 'src/app/bed-occupancy/bed-occupancy.module';
import { BedOccupancyNotificationFormDefinitionService } from 'src/app/bed-occupancy/services/bed-occupancy-notification-form-definition.service';
import { BedOccupancyClipboardDataService } from 'src/app/bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { BedOccupancyStorageService } from 'src/app/shared/services/bed-occupancy-storage.service';
import { FhirBedOccupancyService } from 'src/app/shared/services/fhir-bed-occupancy.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { getHtmlButtonElement } from 'src/test/shared/html-element-utils';
import { getButton, getInput, getSelect, selectOption } from 'src/test/shared/material-harness-utils';
import { MatInputHarness } from '@angular/material/input/testing';
// import {checkDescribingError} from "src/test/shared/assertion-utils";
import { ChangeDetectorRef } from '@angular/core';

const TEST_DATA = {
  hospitalLocation: {
    id: 654322,
    ik: '123494546',
    label: 'Krankenhaus Melissa David TEST-ONLY',
    postalCode: '12346',
    city: 'Mannheim',
    line: 'Mittelweg',
    houseNumber: '28',
  },
};

const overrides = {
  get bedOccupancyStorageService() {
    return {
      fetchHospitalLocations: jasmine.createSpy('fetchHospitalLocations').and.returnValue(of([TEST_DATA.hospitalLocation])),
      getLocalStorageBedOccupancyData: jasmine.createSpy('getLocalStorageBedOccupancyData').and.returnValue(of({ address: {} })),
    } as Partial<BedOccupancyStorageService>;
  },
  get bedOccupancyClipboardDataService() {
    return {
      clipboardData$: of(),
    } as Partial<BedOccupancyClipboardDataService>;
  },
  get bedOccupancyNotificationFormDefinitionService() {
    return {
      hexhexButtonClick$: of(),
    } as Partial<BedOccupancyNotificationFormDefinitionService>;
  },
  get activatedRoute() {
    return {
      fragment: of(''),
    } as Partial<ActivatedRoute>;
  },
};

describe('Bed Occupancy - Integration Tests', () => {
  let component: BedOccupancyComponent;
  let fixture: MockedComponentFixture<BedOccupancyComponent>;
  let loader: HarnessLoader;

  let fetchHospitalLocationsSpy: jasmine.Spy;
  let transformDataSpy: jasmine.Spy;
  let setLocalStorageBedOccupancyDataSpy: jasmine.Spy;
  let openSubmitDialogSpy: jasmine.Spy;

  beforeEach(() =>
    MockBuilder([BedOccupancyComponent, NoopAnimationsModule, SharedModule, BedOccupancyModule, ReactiveFormsModule, MatFormFieldModule])
      .provide(MockProvider(BedOccupancyStorageService, overrides.bedOccupancyStorageService))
      .provide(MockProvider(FhirBedOccupancyService))
      .provide(MockProvider(BedOccupancyClipboardDataService, overrides.bedOccupancyClipboardDataService))
      .provide(MockProvider(BedOccupancyNotificationFormDefinitionService, overrides.bedOccupancyNotificationFormDefinitionService))
      .provide(MockProvider(ActivatedRoute, overrides.activatedRoute))
  );

  beforeEach(() => {
    fixture = MockRender(BedOccupancyComponent);
    fetchHospitalLocationsSpy = TestBed.inject(BedOccupancyStorageService).fetchHospitalLocations as jasmine.Spy;
    transformDataSpy = spyOn(TestBed.inject(FhirBedOccupancyService), 'transformData');
    setLocalStorageBedOccupancyDataSpy = spyOn(TestBed.inject(BedOccupancyStorageService), 'setLocalStorageBedOccupancyData');
    openSubmitDialogSpy = spyOn(TestBed.inject(FhirBedOccupancyService), 'openSubmitDialog');
    component = fixture.point.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should not send, when nothing is inserted', async () => {
    const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');
    expect(submitButton).toBeTruthy();
    expect(submitButton.disabled).toBeTrue();
  });

  it('should have a validation error when nothing is inserted and someone blurs from an input', async () => {
    // get the input and set some invalid value
    const firstnameInput = await getInput(loader, '#firstname');
    await firstnameInput.setValue('');
    await firstnameInput.blur(); // Do not forget to blur the input! Otherwise the validation error will not be triggered in the material form field

    // check if the error is displayed
    fixture.detectChanges();
    const describedby = await (await firstnameInput.host()).getAttribute('aria-describedby');
    expect(describedby).withContext('input should have a describedby attribute').toBeTruthy();
    const errorElement = fixture.nativeElement.querySelector(`mat-error#${describedby}`);
    expect(errorElement).withContext('error element should be present').toBeTruthy();
    const formlyError = errorElement.querySelector('formly-validation-message');
    expect(formlyError).withContext('formly error should be present').toBeTruthy();
    expect(formlyError.textContent).toContain('Diese Angabe wird benötigt');
  });

  it('should send, when form is filled correctly', async () => {
    // Form page 1
    const institutionNameSelect = await getSelect(loader, '#institutionName');
    const firstnameInput = await getInput(loader, '#firstname');
    const lastnameInput = await getInput(loader, '#lastname');
    await (await getButton(loader, '#btn-telefonnummer-hinzufügen')).click();
    const phoneNoInput = await getInput(loader, '[data-cy=phoneNo]');
    await (await getButton(loader, '#btn-email-adresse-hinzufügen')).click();
    const emailInput = await getInput(loader, '[data-cy=email]');
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

    expect(await submitButton.disabled).toBeFalse();
  });
  describe('Validation of email and phone number', () => {
    const parameters = {
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
    parameters.email.forEach(parameter => {
      it(`for the email, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await (await getButton(loader, '#btn-email-adresse-hinzufügen')).click();
        const emailInput = await getInput(loader, '[data-cy=email]');
        await emailInput.setValue(parameter.value);
        await emailInput.blur();

        await checkDescribingError(emailInput, parameter.expectedResult);
      });
    });
    parameters.phoneNumber.forEach(parameter => {
      it(`for the phone number, the value: '${parameter.value}' should throw the error: '${parameter.expectedResult}'`, async () => {
        await (await getButton(loader, '#btn-telefonnummer-hinzufügen')).click();
        const phoneNoInput = await getInput(loader, '[data-cy=phoneNo]');
        await phoneNoInput.setValue(parameter.value);
        await phoneNoInput.blur();

        await checkDescribingError(phoneNoInput, parameter.expectedResult);
      });
    });
  });

  async function checkDescribingError(input: MatInputHarness, expectedResult: String) {
    fixture.detectChanges();
    const describedby = await (await input.host()).getAttribute('aria-describedby');
    expect(describedby).withContext('input should have a describedby attribute').toBeTruthy();
    const errorElement = fixture.nativeElement.querySelector(`mat-error#${describedby}`);
    expect(errorElement).withContext('error element should be present').toBeTruthy();
    const formlyError = errorElement.querySelector('formly-validation-message');
    expect(formlyError).withContext('formly error should be present').toBeTruthy();
    expect(formlyError.textContent).toContain(expectedResult);
  }
});

describe('Validation of occupied and available beds', () => {
  const parameters = {
    testParameter: [
      { value: '-10', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
      { value: '1234567', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
      { value: 'abc', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
      { value: '#+´?|<>\\', expectedResult: 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.' },
    ],
  };

  let component: BedOccupancyComponent;
  let fixture: ComponentFixture<BedOccupancyComponent>;
  let loader: HarnessLoader;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BedOccupancyComponent],
      imports: [NoopAnimationsModule, SharedModule, BedOccupancyModule, ReactiveFormsModule, MatFormFieldModule],
      providers: [
        MockProvider(BedOccupancyStorageService, overrides.bedOccupancyStorageService),
        MockProvider(FhirBedOccupancyService),
        MockProvider(BedOccupancyClipboardDataService, overrides.bedOccupancyClipboardDataService),
        MockProvider(BedOccupancyNotificationFormDefinitionService, overrides.bedOccupancyNotificationFormDefinitionService),
        MockProvider(ActivatedRoute, overrides.activatedRoute),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BedOccupancyComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);

    // Initial detection cycle
    fixture.detectChanges();
  });

  // Helper function to wait for Angular to stabilize
  const waitForStability = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    // Add a small delay to ensure all async operations complete
    await new Promise(resolve => setTimeout(resolve, 50));
    fixture.detectChanges();
  };

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
    await waitForStability();

    // Add phone number
    await (await getButton(loader, '#btn-telefonnummer-hinzufügen')).click();
    await waitForStability();
    const phoneNoInput = await getInput(loader, '[data-cy=phoneNo]');
    await phoneNoInput.setValue('0800123456');
    await waitForStability();

    // Add email
    await (await getButton(loader, '#btn-email-adresse-hinzufügen')).click();
    await waitForStability();
    const emailInput = await getInput(loader, '[data-cy=email]');
    await emailInput.setValue('homer@simpson.com');
    await waitForStability();

    // Navigate to next page
    const nextButton = getHtmlButtonElement(fixture.nativeElement, '#btn-nav-action-next');
    nextButton.click();
    await waitForStability();

    // Verify navigation
    expect(fixture.nativeElement.querySelector('.main-content-small-stepper').textContent).toBe(' Schritt 2 von 2 ');
  }

  async function setupPage2() {
    // Wait for page to be fully loaded
    await waitForStability();

    // Fill in form data sequentially with proper waits
    const occupiedBedsAdultsInput = await getInput(loader, '#occupied-beds-adults-number-of-beds');
    await occupiedBedsAdultsInput.setValue('33');
    await waitForStability();

    const occupiedBedsChildrenInput = await getInput(loader, '#occupied-beds-children-number-of-beds');
    await occupiedBedsChildrenInput.setValue('5');
    await waitForStability();

    const operableBedsAdultsInput = await getInput(loader, '#operable-beds-adults-number-of-beds');
    await operableBedsAdultsInput.setValue('55');
    await waitForStability();

    const operableBedsChildrenInput = await getInput(loader, '#operable-beds-children-number-of-beds');
    await operableBedsChildrenInput.setValue('66');
    await waitForStability();
  }

  // Helper function for testing input validation
  async function testInputValidation(inputSelector: string, testValue: string, testExpectation: string) {
    await setupFormPage1();
    await setupPage2();

    // Get the input, set value and trigger validation
    const inputElement = await getInput(loader, inputSelector);
    await inputElement.setValue(testValue);
    await waitForStability();
    await inputElement.blur();
    await waitForStability();

    await checkDescribingError(inputElement, testExpectation);
    // Verify submit button is disabled when validation fails
    const submitButton = getHtmlButtonElement(fixture.nativeElement, '#btn-send-notification');
    expect(submitButton.disabled).withContext(`Submit button should be disabled for value: ${testValue}`).toBeTrue();
  }

  async function checkDescribingError(input: MatInputHarness, expectedResult: String) {
    fixture.detectChanges();
    const describedby = await (await input.host()).getAttribute('aria-describedby');
    expect(describedby).withContext('input should have a describedby attribute').toBeTruthy();
    const errorElement = fixture.nativeElement.querySelector(`mat-error#${describedby}`);
    expect(errorElement).withContext('error element should be present').toBeTruthy();
    const formlyError = errorElement.querySelector('formly-validation-message');
    expect(formlyError).withContext('formly error should be present').toBeTruthy();
    expect(formlyError.textContent).toContain(expectedResult);
  }

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
