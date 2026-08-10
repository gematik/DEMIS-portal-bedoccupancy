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

import { vi } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BedOccupancyNewComponent } from 'src/app/bed-occupancy-new/bed-occupancy-new.component';
import { BedOccupancyClipboardDataService } from 'src/app/bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemisProcessStepperComponent } from '@gematik/demis-portal-core-library';
import { NotifierFacilityComponent } from 'src/app/bed-occupancy-new/notifier-facility/notifier-facility.component';
import { BedOccupancyQuestionComponent } from 'src/app/bed-occupancy-new/bed-occupancy-question/bed-occupancy-question.component';
import { NGXLogger } from 'ngx-logger';
import { MockProvider } from 'ng-mocks';
import { BedOccupancyStorageService } from 'src/app/shared/services/bed-occupancy-storage.service';
import { FhirBedOccupancyService } from '../../app/shared/services/fhir-bed-occupancy.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BedOccupancyModule } from '../../app/bed-occupancy/bed-occupancy.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

export const TEST_DATA = {
  bedOccupancyQuestion: {
    occupiedBeds: {
      adultsNumberOfBeds: 10,
      childrenNumberOfBeds: 5,
    },
    operableBeds: {
      adultsNumberOfBeds: 20,
      childrenNumberOfBeds: 10,
    },
  },
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
      getLocalStorageBedOccupancyData: vi
        .fn()
        .mockName('getLocalStorageBedOccupancyData')
        .mockReturnValue(of({ address: {} })),
    } as Partial<BedOccupancyStorageService>;
  },
  get activatedRoute() {
    return {
      fragment: of(''),
    } as Partial<ActivatedRoute>;
  },
};

export async function configureIntegrationTestBed() {
  await TestBed.configureTestingModule({
    imports: [
      NoopAnimationsModule,
      SharedModule,
      BedOccupancyNewComponent,
      DemisProcessStepperComponent,
      NotifierFacilityComponent,
      BedOccupancyQuestionComponent,
      BedOccupancyModule,
      ReactiveFormsModule,
      MatFormFieldModule,
    ],
    providers: [
      MockProvider(BedOccupancyStorageService, overrides.bedOccupancyStorageService),
      MockProvider(FhirBedOccupancyService),
      BedOccupancyClipboardDataService,
      MockProvider(ActivatedRoute, overrides.activatedRoute),
      MockProvider(NGXLogger),
    ],
  }).compileComponents();
}
