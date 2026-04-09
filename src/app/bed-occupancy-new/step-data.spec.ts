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

import { getStepData } from './step-data';
import { BedOccupancyNotificationService } from './bed-occupancy-notification.service';
import { BedOccupancyConstants } from '../bed-occupancy/common/bed-occupancy-constants';

describe('getStepData', () => {
  let mockNotificationService: jasmine.SpyObj<BedOccupancyNotificationService>;

  beforeEach(() => {
    mockNotificationService = jasmine.createSpyObj('BedOccupancyNotificationService', [], {
      notifierFacilityGroup: { id: 'facilityGroup' },
      bedOccupancyQuestionGroup: { id: 'questionGroup' },
    });
  });

  it('should return correct step data', () => {
    const steps = getStepData(mockNotificationService);
    expect(steps.length).toBe(2);
    expect(steps[0]).toEqual({
      key: 'notifierFacility',
      label: BedOccupancyConstants.MELDENDE_EINRICHTUNG,
      control: mockNotificationService.notifierFacilityGroup,
    });
    expect(steps[1]).toEqual({
      key: 'bedOccupancyQuestion',
      label: BedOccupancyConstants.BETTENBELEGUNG,
      control: mockNotificationService.bedOccupancyQuestionGroup,
    });
  });
});
