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

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockBuilder, MockProvider } from 'ng-mocks';

import { BedOccupancyNotificationService } from './bed-occupancy-notification.service';
import { FhirBedOccupancyService } from '../shared/services/fhir-bed-occupancy.service';
import { BedOccupancyStorageService } from '../shared/services/bed-occupancy-storage.service';
import { FormlyFormBuilder } from '@ngx-formly/core';

describe('BedOccupancyNotificationService', () => {
  let service: BedOccupancyNotificationService;

  let transformDataSpy: Mock;
  let submitNotificationSpy: Mock;
  let buildFormSpy: Mock;

  beforeEach(() =>
    MockBuilder(BedOccupancyNotificationService)
      .provide(MockProvider(FhirBedOccupancyService))
      .provide(MockProvider(BedOccupancyStorageService))
      .provide(MockProvider(FormlyFormBuilder))
  );

  beforeEach(() => {
    buildFormSpy = vi.spyOn(TestBed.inject(FormlyFormBuilder), 'buildForm').mockImplementation(function (this: FormlyFormBuilder, form: FormGroup) {
      // Simulate Formly registering controls in each pre-built FormGroup so
      // tests can rely on hasControls === true for both groups.
      form.addControl(
        'occupiedBeds',
        new FormGroup({
          adultsNumberOfBeds: new FormControl<number | null>(null),
          childrenNumberOfBeds: new FormControl<number | null>(null),
        })
      );
      form.addControl(
        'operableBeds',
        new FormGroup({
          adultsNumberOfBeds: new FormControl<number | null>(null),
          childrenNumberOfBeds: new FormControl<number | null>(null),
        })
      );
    });
    service = TestBed.inject(BedOccupancyNotificationService);
    transformDataSpy = vi.spyOn(TestBed.inject(FhirBedOccupancyService), 'transformData').mockReturnValue({});
    submitNotificationSpy = vi.spyOn(TestBed.inject(FhirBedOccupancyService), 'submitNotification');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('constructor pre-builds both FormGroups via FormlyFormBuilder', () => {
    expect(buildFormSpy).toHaveBeenCalledTimes(2);
    const groupsBuilt = buildFormSpy.mock.calls.map(args => args[0]);
    expect(groupsBuilt).toContain(service.notifierFacilityGroup);
    expect(groupsBuilt).toContain(service.bedOccupancyQuestionGroup);
    // After pre-build both FormGroups already have controls before their step renders.
    expect(Object.keys(service.bedOccupancyQuestionGroup.controls).length).toBeGreaterThan(0);
  });

  it('sendData should transform and submit data from models', () => {
    const expectedData = {
      notifierFacility: {
        facilityInfo: { ikNumber: '123456789' },
        name: 'Test Hospital',
      },
      bedOccupancyQuestion: {
        occupiedBeds: { adultsNumberOfBeds: 10 },
      },
    };
    service.notifierFacilityModel.set(expectedData.notifierFacility);
    service.bedOccupancyQuestionModel.set(expectedData.bedOccupancyQuestion);

    transformDataSpy.mockReturnValue({ transformed: true });

    service.sendData();

    expect(transformDataSpy).toHaveBeenCalledWith(expectedData);

    expect(submitNotificationSpy).toHaveBeenCalledWith({ transformed: true });
  });

  it('FormGroups are pre-built with controls already registered', () => {
    expect(Object.keys(service.bedOccupancyQuestionGroup.controls).length).toBeGreaterThan(0);
  });

  it('patchFormData writes into the pre-built bedOccupancyQuestion FormGroup immediately', () => {
    let statusChangesFired = false;
    service.bedOccupancyQuestionGroup.statusChanges.subscribe(() => (statusChangesFired = true));

    service.patchFormData({
      bedOccupancyQuestion: {
        occupiedBeds: { adultsNumberOfBeds: 7, childrenNumberOfBeds: 2 },
      },
    });
    expect((service.bedOccupancyQuestionGroup.value as any).occupiedBeds.adultsNumberOfBeds).toBe(7);
    expect((service.bedOccupancyQuestionGroup.value as any).occupiedBeds.childrenNumberOfBeds).toBe(2);
    expect(service.bedOccupancyQuestionGroup.touched).toBe(true);
    expect(statusChangesFired).toBe(true);
  });
  it('patchFormData should update notifierFacility form group with deep merge', () => {
    // initial state in group (controls are registered)
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string | null>(null),
      address: new FormGroup({
        line: new FormControl<string | null>(null),
        houseNumber: new FormControl<string | null>(null),
        postalCode: new FormControl<string | null>(null),
        city: new FormControl<string | null>(null),
        country: new FormControl<string | null>(null),
      }),
    }) as any;

    service.notifierFacilityGroup.patchValue({
      name: 'Initial Hospital',
      address: {
        line: 'Main Street',
        houseNumber: '1',
        postalCode: '12345',
        city: 'Initial City',
        country: 'DE',
      },
    });

    const patchData = {
      notifierFacility: {
        address: {
          city: 'Updated City',
          country: 'DE',
        },
      },
    };

    const markAllAsTouchedSpy = vi.spyOn(service.notifierFacilityGroup, 'markAllAsTouched');
    const updateValueAndValiditySpy = vi.spyOn(service.notifierFacilityGroup, 'updateValueAndValidity');

    service.patchFormData(patchData);

    const groupValue = service.notifierFacilityGroup.value as any;
    expect(groupValue.address.city).toBe('Updated City');
    expect(groupValue.address.line).toBe('Main Street');

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(updateValueAndValiditySpy).toHaveBeenCalledWith({ emitEvent: true });
  });

  it('patchFormData should update bedOccupancyQuestion form group', () => {
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormGroup({
        adultsNumberOfBeds: new FormControl<number | null>(null),
      }),
    }) as any;

    const patchData = {
      bedOccupancyQuestion: {
        occupiedBeds: {
          adultsNumberOfBeds: 5,
        },
      },
    };

    const markAllAsTouchedSpy = vi.spyOn(service.bedOccupancyQuestionGroup, 'markAllAsTouched');
    const updateValueAndValiditySpy = vi.spyOn(service.bedOccupancyQuestionGroup, 'updateValueAndValidity');

    service.patchFormData(patchData);

    expect((service.bedOccupancyQuestionGroup.value as any).occupiedBeds.adultsNumberOfBeds).toBe(5);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(updateValueAndValiditySpy).toHaveBeenCalledWith({ emitEvent: true });
  });

  it('getFormData should return values from form groups', () => {
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string | null>(null),
    }) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      test: new FormControl<string | null>(null),
    }) as any;

    service.notifierFacilityGroup.patchValue({ name: 'From Form Group' });
    service.bedOccupancyQuestionGroup.patchValue({ test: 'value' });

    const data = service.getFormData();

    expect(data.notifierFacility).toEqual({ name: 'From Form Group' });
    expect(data.bedOccupancyQuestion).toEqual({ test: 'value' });
  });

  it('getModelData should return values from models (signals)', () => {
    service.notifierFacilityModel.set({ foo: 'bar' });
    service.bedOccupancyQuestionModel.set({ baz: 123 });

    const data = service.getModelData();

    expect(data.notifierFacility).toEqual({ foo: 'bar' });
    expect(data.bedOccupancyQuestion).toEqual({ baz: 123 });
  });

  it('isFormValid should return true only if both form groups are valid', () => {
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string>('Test Hospital'),
    }) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormControl<number>(10),
    }) as any;

    // Both groups are valid
    expect(service.isFormValid()).toBe(true);

    // One group invalid should return false
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string>('Test Hospital'),
    }) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormControl<number>(10),
    }) as any;
    vi.spyOn(service.notifierFacilityGroup, 'valid', 'get').mockReturnValue(false);
    expect(service.isFormValid()).toBe(false);

    // The other group invalid should also return false.
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string>('Test Hospital'),
    }) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormControl<number>(10),
    }) as any;
    vi.spyOn(service.bedOccupancyQuestionGroup, 'valid', 'get').mockReturnValue(false);
    expect(service.isFormValid()).toBe(false);
  });
});
