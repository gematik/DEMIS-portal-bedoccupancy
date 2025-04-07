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
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { ErrorMessageDialogComponent } from '../shared/dialogs/message-dialog/error-message-dialog.component';
import { HospitalLocation } from '../shared/models/hospital-location';
import { BedOccupancyStorageService } from '../shared/services/bed-occupancy-storage.service';
import { FhirBedOccupancyService } from '../shared/services/fhir-bed-occupancy.service';
import { SharedModule } from '../shared/shared.module';
import { BedOccupancyComponent } from './bed-occupancy.component';
import { BedOccupancyModule } from './bed-occupancy.module';
import { BedOccupancyConstants } from './common/bed-occupancy-constants';
import { BedOccupancyNotificationFormDefinitionService } from './services/bed-occupancy-notification-form-definition.service';
import { BedOccupancyClipboardDataService } from './services/clipboard/bed-occupancy-clipboard-data.service';

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

describe('BedOccupancyComponent', () => {
  let component: BedOccupancyComponent;
  let fixture: MockedComponentFixture<BedOccupancyComponent, BedOccupancyComponent>;
  let loader: HarnessLoader;

  let fetchHospitalLocationsSpy: jasmine.Spy;
  let transformDataSpy: jasmine.Spy;
  let setLocalStorageBedOccupancyDataSpy: jasmine.Spy;
  let openSubmitDialogSpy: jasmine.Spy;

  describe('Unit Tests', () => {
    beforeEach(() =>
      MockBuilder([BedOccupancyComponent, BedOccupancyModule, NoopAnimationsModule, SharedModule, ReactiveFormsModule, MatFormFieldModule, ChangeDetectorRef])
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

    it('should create', () => {
      expect(component).toBeTruthy();
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
      fetchHospitalLocationsSpy.and.returnValue(of(hospitalLocations));

      component.ngOnInit();

      expect(fetchHospitalLocationsSpy).toHaveBeenCalled();
      expect(component.hospitalLocations).toEqual(hospitalLocations);
      expect(component.IkNumber).toBe('12345');
    });

    it('should handle error when fetching hospital locations', () => {
      const error = new Error('Failed to fetch locations');
      fetchHospitalLocationsSpy.and.returnValue(throwError(() => error));
      const openSpy = spyOn(component.dialog, 'open');

      component.ngOnInit();

      expect(fetchHospitalLocationsSpy).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledWith(
        ErrorMessageDialogComponent,
        ErrorMessageDialogComponent.getErrorDialogCommonData(error, BedOccupancyConstants.ERROR_NO_LOCATIONS_DIALOG)
      );
    });

    it('should mark form group as touched', () => {
      const formGroup = new FormGroup({
        testGroup: new FormGroup({
          testControl: new FormControl('testValue'),
        }),
        testControl2: new FormControl('testValue2'),
      });
      spyOn(formGroup, 'markAsTouched');

      component.markFormGroupTouched(formGroup);

      expect(formGroup.markAsTouched).toHaveBeenCalled();
    });

    it('should submit form', () => {
      const transformedData = {};
      transformDataSpy.and.returnValue(transformedData);
      component.submit();
      expect(transformDataSpy).toHaveBeenCalledWith(component.model);
      expect(setLocalStorageBedOccupancyDataSpy).toHaveBeenCalledWith(component.IkNumber, component.model.notifierFacility);
      expect(openSubmitDialogSpy).toHaveBeenCalledWith(transformedData);
    });

    it('should unsubscribe on destroy', () => {
      spyOn(component.hospitalLocationsSubscription, 'unsubscribe');
      spyOn(component['copyPasteBoxData'], 'unsubscribe');
      spyOn(component['copyHexHexButtonData'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component.hospitalLocationsSubscription.unsubscribe).toHaveBeenCalled();
      expect(component['copyPasteBoxData'].unsubscribe).toHaveBeenCalled();
      expect(component['copyHexHexButtonData'].unsubscribe).toHaveBeenCalled();
    });
  });
});
