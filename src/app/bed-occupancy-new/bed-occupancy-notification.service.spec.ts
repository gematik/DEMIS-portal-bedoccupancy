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

import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockBuilder, MockProvider } from 'ng-mocks';

import { BedOccupancyNotificationService } from './bed-occupancy-notification.service';
import { FhirBedOccupancyService } from '../shared/services/fhir-bed-occupancy.service';
import { BedOccupancyStorageService } from '../shared/services/bed-occupancy-storage.service';

describe('BedOccupancyNotificationService', () => {
  let service: BedOccupancyNotificationService;

  let transformDataSpy: jasmine.Spy;
  let submitNotificationSpy: jasmine.Spy;

  beforeEach(() =>
    MockBuilder(BedOccupancyNotificationService).provide(MockProvider(FhirBedOccupancyService)).provide(MockProvider(BedOccupancyStorageService))
  );

  beforeEach(() => {
    service = TestBed.inject(BedOccupancyNotificationService);
    transformDataSpy = spyOn(TestBed.inject(FhirBedOccupancyService), 'transformData').and.returnValue({});
    submitNotificationSpy = spyOn(TestBed.inject(FhirBedOccupancyService), 'submitNotification');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sendData should transform and submit data and store notifierFacility in local storage', () => {
    const notifierFacility = {
      facilityInfo: { ikNumber: '123456789' },
      name: 'Test Hospital',
    } as any;
    const bedOccupancyQuestion = {
      occupiedBeds: { adultsNumberOfBeds: 10 },
    } as any;

    service.notifierFacilityModel.set(notifierFacility);
    service.bedOccupancyQuestionModel.set(bedOccupancyQuestion);

    const expectedModel = {
      notifierFacility,
      bedOccupancyQuestion,
    };

    transformDataSpy.and.returnValue({ transformed: true });

    service.sendData();

    expect(transformDataSpy).toHaveBeenCalledWith(expectedModel);
    expect(submitNotificationSpy).toHaveBeenCalledWith({ transformed: true });
  });

  it('patchFormData should update notifierFacility model and form group with deep merge', () => {
    // initial state in model and group
    service.notifierFacilityModel.set({
      name: 'Initial Hospital',
      address: {
        line: 'Main Street',
        houseNumber: '1',
        postalCode: '12345',
        city: 'Initial City',
        country: 'DE',
      },
    });
    service.notifierFacilityGroup = new FormGroup({});
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

    const markAllAsTouchedSpy = spyOn(service.notifierFacilityGroup, 'markAllAsTouched').and.callThrough();
    const updateValueAndValiditySpy = spyOn(service.notifierFacilityGroup, 'updateValueAndValidity').and.callThrough();

    service.patchFormData(patchData);

    const modelValue = service.notifierFacilityModel();
    expect(modelValue.address.city).toBe('Updated City');
    expect(modelValue.address.line).toBe('Main Street');

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(updateValueAndValiditySpy).toHaveBeenCalledWith({ emitEvent: true });
  });

  it('patchFormData should update bedOccupancyQuestion model and form group', () => {
    service.bedOccupancyQuestionGroup = new FormGroup({});

    const patchData = {
      bedOccupancyQuestion: {
        occupiedBeds: {
          adultsNumberOfBeds: 5,
        },
      },
    };

    const markAllAsTouchedSpy = spyOn(service.bedOccupancyQuestionGroup, 'markAllAsTouched').and.callThrough();
    const updateValueAndValiditySpy = spyOn(service.bedOccupancyQuestionGroup, 'updateValueAndValidity').and.callThrough();

    service.patchFormData(patchData);

    const modelValue = service.bedOccupancyQuestionModel();
    expect(modelValue.occupiedBeds.adultsNumberOfBeds).toBe(5);
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

  it('isFormValid should return true only if both form groups are valid and contain data', () => {
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string>('Test Hospital'),
    }) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormControl<number>(10),
    }) as any;

    // Both groups are valid and contain data
    expect(service.isFormValid()).toBeTrue();

    // Empty FormGroups should return false even if valid
    service.notifierFacilityGroup = new FormGroup({});
    service.bedOccupancyQuestionGroup = new FormGroup({});
    expect(service.isFormValid()).toBeFalse();

    // One group invalid should return false
    service.notifierFacilityGroup = new FormGroup({
      name: new FormControl<string>('Test Hospital'),
    }) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormControl<number>(10),
    }) as any;
    spyOnProperty(service.notifierFacilityGroup, 'valid', 'get').and.returnValue(false);
    expect(service.isFormValid()).toBeFalse();

    // One group empty should return false
    service.notifierFacilityGroup = new FormGroup({}) as any;
    service.bedOccupancyQuestionGroup = new FormGroup({
      occupiedBeds: new FormControl<number>(10),
    }) as any;
    spyOnProperty(service.notifierFacilityGroup, 'valid', 'get').and.returnValue(true);
    spyOnProperty(service.bedOccupancyQuestionGroup, 'valid', 'get').and.returnValue(true);
    expect(service.isFormValid()).toBeFalse();
  });
});
