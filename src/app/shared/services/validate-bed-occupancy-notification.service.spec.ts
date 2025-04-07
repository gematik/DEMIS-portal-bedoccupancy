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

import { TestBed } from '@angular/core/testing';

import { ValidateBedOccupancyNotificationService } from './validate-bed-occupancy-notification.service';

describe('ValidateBedOccupancyNotificationService', () => {
  let service: ValidateBedOccupancyNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateBedOccupancyNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateNoOfBeds', () => {
    describe('should return true when', () => {
      const parameters = [
        {
          description: 'all 4 variables are correct',
          input: createBedOccupancyQuestion(1, 2, 3, 4),
        },
        {
          description: 'all occupied beds only are set',
          input: createBedOccupancyQuestion(1, 2, null, null),
        },
        {
          description: '3 variables are correct and obligatory children is not set',
          input: createBedOccupancyQuestion(1, 2, 3, null),
        },
        {
          description: '3 variables are correct and obligatory adults is not set',
          input: createBedOccupancyQuestion(1, 2, null, 4),
        },
      ];
      parameters.forEach(parameter => {
        it(parameter.description, () => {
          expect(service.validateBedOccupancyQuestion(parameter.input)).toBe(true);
        });
      });
    });

    describe('should return false when', () => {
      const parameters = [
        {
          description: 'no variables are set',
          input: createBedOccupancyQuestion(null, null, null, null),
        },
        {
          description: 'adults only occupied bed is set',
          input: createBedOccupancyQuestion(1, null, null, null),
        },
        {
          description: 'children only occupied bed is set',
          input: createBedOccupancyQuestion(null, 2, null, null),
        },
        {
          description: 'children occupied bed is no number and adults is number',
          input: createBedOccupancyQuestion(1, 'Test', null, null),
        },
        {
          description: 'adults occupied bed is no number and children is number',
          input: createBedOccupancyQuestion('Test', 2, null, null),
        },
        {
          description: 'adults operable bed is no number',
          input: createBedOccupancyQuestion(1, 2, 'Test', null),
        },
        {
          description: 'children operable bed is no number',
          input: createBedOccupancyQuestion(1, 1, null, 'Test'),
        },
        {
          description: 'adults occupied bed is no number and children is number',
          input: createBedOccupancyQuestion(1, 2, 'Test', 'Test'),
        },
        {
          description: 'adults operable bed is no number but children is',
          input: createBedOccupancyQuestion(1, 2, 'Test', 4),
        },
        {
          description: 'children operable bed is no number but adults is',
          input: createBedOccupancyQuestion(1, 1, 3, 'Test'),
        },
      ];
      parameters.forEach(parameter => {
        it(parameter.description, () => {
          expect(service.validateBedOccupancyQuestion(parameter.input)).toBe(false);
        });
      });
    });
  });
});

function createBedOccupancyQuestion(occBedsAdultsNo, occBedsChildrenNo, opBedsAdultsNo, opBedsChildrenNo) {
  return {
    occupiedBeds: {
      adultsNumberOfBeds: occBedsAdultsNo,
      childrenNumberOfBeds: occBedsChildrenNo,
    },
    operableBeds: {
      adultsNumberOfBeds: opBedsAdultsNo,
      childrenNumberOfBeds: opBedsChildrenNo,
    },
  };
}
