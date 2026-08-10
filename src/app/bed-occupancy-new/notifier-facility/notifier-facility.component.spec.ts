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
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { MessageDialogService, StepNavigation } from '@gematik/demis-portal-core-library';

import { NotifierFacilityComponent } from './notifier-facility.component';
import { BedOccupancyStorageService } from '../../shared/services/bed-occupancy-storage.service';
import { BedOccupancyNotificationService } from '../bed-occupancy-notification.service';
import { BedOccupancyConstants } from '../../bed-occupancy/common/bed-occupancy-constants';
import { HospitalLocation } from '../../shared/models/hospital-location';
import { BedOccupancyNotifierFacility } from '../../../api/notification';
import { FormGroup } from '@angular/forms';

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
      fetchHospitalLocations: vi
        .fn()
        .mockName('fetchHospitalLocations')
        .mockReturnValue(of([TEST_DATA.hospitalLocation])),
      getLocalStorageBedOccupancyData: vi.fn().mockName('getLocalStorageBedOccupancyData').mockReturnValue(null),
      setLocalStorageBedOccupancyData: vi.fn().mockName('setLocalStorageBedOccupancyData'),
    } as Partial<BedOccupancyStorageService>;
  },
  get notificationService() {
    const dummyModel: BedOccupancyNotifierFacility = {
      facilityInfo: { institutionName: 'Test Insitution', bsnr: '123494546' },
      address: {
        street: 'Street',
        houseNumber: '1',
        zip: '12345',
        city: 'City',
        country: 'DE',
      },
      contacts: [],
      contact: undefined,
      locationID: 'LOC-1',
    };

    return {
      patchFormData: vi.fn().mockName('patchFormData'),
      notifierFacilityModel: vi.fn().mockName('notifierFacilityModel').mockReturnValue(dummyModel),
      notifierFacilityGroup: new FormGroup({}),
      getFormData: vi.fn().mockName('getFormData').mockReturnValue({ notifierFacility: dummyModel }),
      getModelData: vi.fn().mockName('getModelData').mockReturnValue({ notifierFacility: dummyModel }),
      sendData: vi.fn().mockName('sendData'),
      isFormValid: vi.fn().mockName('isFormValid').mockReturnValue(true),
    } as unknown as Partial<BedOccupancyNotificationService>;
  },
  get messageDialogService() {
    return {
      extractMessageFromError: vi
        .fn()
        .mockName('extractMessageFromError')
        .mockImplementation((error: unknown) => (error as Error).message),
      showErrorDialog: vi.fn().mockName('showErrorDialog'),
    } as Partial<MessageDialogService>;
  },
  get stepNavigationService() {
    return {
      canGoToPrevious: signal(true),
      canGoToNext: signal(true),
      previous: vi.fn().mockName('previous'),
      next: vi.fn().mockName('next'),
    } as Partial<StepNavigation>;
  },
};

describe('NotifierFacilityComponent', () => {
  let component: NotifierFacilityComponent;
  let fixture: MockedComponentFixture<NotifierFacilityComponent, NotifierFacilityComponent>;

  let fetchHospitalLocationsSpy: Mock;
  let getLocalStorageBedOccupancyDataSpy: Mock;

  describe('Unit Tests', () => {
    beforeEach(() =>
      MockBuilder(NotifierFacilityComponent)
        .provide(MockProvider(BedOccupancyStorageService, overrides.bedOccupancyStorageService))
        .provide(MockProvider(BedOccupancyNotificationService, overrides.notificationService))
        .provide(MockProvider(MessageDialogService, overrides.messageDialogService))
        .provide({
          provide: StepNavigation,
          useValue: overrides.stepNavigationService,
        })
    );

    beforeEach(() => {
      ngMocks.flushTestBed();
      fixture = MockRender(NotifierFacilityComponent);
      component = fixture.point.componentInstance;
      fetchHospitalLocationsSpy = TestBed.inject(BedOccupancyStorageService).fetchHospitalLocations as Mock;
      getLocalStorageBedOccupancyDataSpy = TestBed.inject(BedOccupancyStorageService).getLocalStorageBedOccupancyData as Mock;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize field config before hospital locations are loaded', () => {
      expect(component['fieldConfig']).toBeDefined();
      expect(component['fieldConfig'].length).toBeGreaterThan(0);
    });

    it('should fetch hospital locations on init', () => {
      const hospitalLocations: HospitalLocation[] = [
        {
          id: 1,
          ik: '12345',
          label: 'Hospital A',
          postalCode: '12345',
          city: 'City A',
          line: 'Street A',
          houseNumber: '1',
        },
        {
          id: 2,
          ik: '98765',
          label: 'Hospital B',
          postalCode: '54321',
          city: 'City B',
          line: 'Street B',
          houseNumber: '2',
        },
      ];
      fetchHospitalLocationsSpy.mockReturnValue(of(hospitalLocations));

      component.ngOnInit();

      expect(fetchHospitalLocationsSpy).toHaveBeenCalled();
      expect(component.hospitalLocations).toEqual(hospitalLocations);
      expect(component.IkNumber).toBe('12345');
      expect(component['fieldConfig']).toBeDefined();
    });

    it('should patch notifier facility data from local storage and override country', () => {
      const storedData = {
        name: 'Test Facility',
        address: {
          line: 'Street',
          houseNumber: '1',
          postalCode: '12345',
          city: 'City',
          country: 'FR',
        },
      };

      fetchHospitalLocationsSpy.mockReturnValue(of([TEST_DATA.hospitalLocation]));
      getLocalStorageBedOccupancyDataSpy.mockReturnValue(storedData);

      const patchFormDataSpy = TestBed.inject(BedOccupancyNotificationService).patchFormData as Mock;

      component.ngOnInit();

      expect(getLocalStorageBedOccupancyDataSpy).toHaveBeenCalledWith(TEST_DATA.hospitalLocation.ik);
      expect(patchFormDataSpy).toHaveBeenCalledWith(
        {
          notifierFacility: {
            ...storedData,
            address: {
              ...storedData.address,
              country: 'DE',
            },
          },
        },
        { markAsTouched: false }
      );
    });

    it('should handle error when fetching hospital locations', () => {
      const error = new Error('Failed to fetch locations');
      fetchHospitalLocationsSpy.mockReturnValue(throwError(() => error));

      const extractMessageFromErrorSpy = TestBed.inject(MessageDialogService).extractMessageFromError as Mock;
      const showErrorDialogSpy = TestBed.inject(MessageDialogService).showErrorDialog as Mock;

      component.ngOnInit();

      expect(fetchHospitalLocationsSpy).toHaveBeenCalled();
      expect(extractMessageFromErrorSpy).toHaveBeenCalledWith(error);
      expect(showErrorDialogSpy).toHaveBeenCalledWith({
        redirectToHome: true,
        errorTitle: BedOccupancyConstants.ERROR_NO_LOCATIONS_DIALOG,
        errors: [
          {
            text: error.message,
          },
        ],
      });
    });

    it('should set IkNumber to "not-provided" when no hospital locations are returned', () => {
      fetchHospitalLocationsSpy.mockReturnValue(of([]));

      component.ngOnInit();

      expect(component.hospitalLocations).toEqual([]);
      expect(component.IkNumber).toBe('not-provided');
    });
  });
});
