/*
    Copyright (c) 2025 gematik GmbH
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

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BedOccupancyClipboardDataService } from './bed-occupancy-clipboard-data.service';
import { BedOccupancyQuestionClipboard } from './clipboard-enums';
import { MatDialogModule } from '@angular/material/dialog';

describe('BedOccupancyClipboardDataService', () => {
  let service: BedOccupancyClipboardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, LoggerTestingModule],
      providers: [provideHttpClient(withInterceptorsFromDi())],
    });
    service = TestBed.inject(BedOccupancyClipboardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertClipBoardDataToMap and fill out beds', () => {
    const ADULTS_OPERABLE = '1';
    const CHILDREN_OPERABLE = '2';
    const ADULTS_OCCUPIED = '3';
    const CHILDREN_OCCUPIED = '4';
    it('should map valid bedoccupancy', () => {
      const validMap = service.convertClipBoardDataToMap(
        `URL ${BedOccupancyQuestionClipboard.ADULTS_OPERABLE}=${ADULTS_OPERABLE}&${BedOccupancyQuestionClipboard.CHILDREN_OPERABLE}=${CHILDREN_OPERABLE}&${BedOccupancyQuestionClipboard.ADULTS_OCCUPIED}=${ADULTS_OCCUPIED}&${BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED}=${CHILDREN_OCCUPIED}`
      );
      expect(validMap.size).toBe(4);
      expect(validMap.get(BedOccupancyQuestionClipboard.ADULTS_OPERABLE)).toEqual(ADULTS_OPERABLE);
      expect(validMap.get(BedOccupancyQuestionClipboard.CHILDREN_OPERABLE)).toEqual(CHILDREN_OPERABLE);
      expect(validMap.get(BedOccupancyQuestionClipboard.ADULTS_OCCUPIED)).toEqual(ADULTS_OCCUPIED);
      expect(validMap.get(BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED)).toEqual(CHILDREN_OCCUPIED);
    });

    it('should map partial bedoccupancy', () => {
      const validMap = service.convertClipBoardDataToMap(
        `URL ${BedOccupancyQuestionClipboard.ADULTS_OPERABLE}=${ADULTS_OPERABLE}&${BedOccupancyQuestionClipboard.ADULTS_OCCUPIED}=${ADULTS_OCCUPIED}`
      );
      expect(validMap.size).toBe(2);
      expect(validMap.get(BedOccupancyQuestionClipboard.ADULTS_OPERABLE)).toEqual(ADULTS_OPERABLE);
      expect(validMap.get(BedOccupancyQuestionClipboard.CHILDREN_OPERABLE)).toBeUndefined();
      expect(validMap.get(BedOccupancyQuestionClipboard.ADULTS_OCCUPIED)).toEqual(ADULTS_OCCUPIED);
      expect(validMap.get(BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED)).toBeUndefined();
    });

    it('should save empty fields as undefined', () => {
      const validMap = service.convertClipBoardDataToMap(
        `URL ${BedOccupancyQuestionClipboard.ADULTS_OPERABLE}=&${BedOccupancyQuestionClipboard.CHILDREN_OPERABLE}=${CHILDREN_OPERABLE}&${BedOccupancyQuestionClipboard.ADULTS_OCCUPIED}=&${BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED}=${CHILDREN_OCCUPIED}`
      );
      expect(validMap.size).toBe(2);
      expect(validMap.get(BedOccupancyQuestionClipboard.ADULTS_OPERABLE)).toBeUndefined();
      expect(validMap.get(BedOccupancyQuestionClipboard.CHILDREN_OPERABLE)).toEqual(CHILDREN_OPERABLE);
      expect(validMap.get(BedOccupancyQuestionClipboard.ADULTS_OCCUPIED)).toBeUndefined();
      expect(validMap.get(BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED)).toEqual(CHILDREN_OCCUPIED);
    });
  });

  describe('convertClipBoardDataToMap', () => {
    it('should use clipboard values when given', () => {
      const testMap = new Map([
        [BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED, '9'],
        [BedOccupancyQuestionClipboard.ADULTS_OCCUPIED, '8'],
        [BedOccupancyQuestionClipboard.CHILDREN_OPERABLE, '7'],
        [BedOccupancyQuestionClipboard.ADULTS_OPERABLE, '6'],
      ]);
      const dataFromClipboard = service.setBedOccupancyQuestionFromClipBoard(testMap);
      expect(dataFromClipboard.operableBeds.childrenNumberOfBeds).toBe(7);
      expect(dataFromClipboard.operableBeds.adultsNumberOfBeds).toBe(6);
      expect(dataFromClipboard.occupiedBeds.childrenNumberOfBeds).toBe(9);
      expect(dataFromClipboard.occupiedBeds.adultsNumberOfBeds).toBe(8);
    });

    it('should use clipboard values', () => {
      const testMapPartial = new Map([
        [BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED, '9'],
        [BedOccupancyQuestionClipboard.CHILDREN_OPERABLE, '7'],
      ]);
      const dataFromClipboard = service.setBedOccupancyQuestionFromClipBoard(testMapPartial);

      expect(dataFromClipboard.operableBeds.childrenNumberOfBeds).toBe(7);
      expect(dataFromClipboard.operableBeds.adultsNumberOfBeds).toBeUndefined();
      expect(dataFromClipboard.occupiedBeds.adultsNumberOfBeds).toBeUndefined();
    });

    it('should use clipboard values when given otherwise  with undefined values', () => {
      const testMapPartial = new Map([
        [BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED, undefined],
        [BedOccupancyQuestionClipboard.ADULTS_OCCUPIED, '0'],
        [BedOccupancyQuestionClipboard.CHILDREN_OPERABLE, undefined],
        [BedOccupancyQuestionClipboard.ADULTS_OPERABLE, '6'],
      ]);
      const dataFromClipboard = service.setBedOccupancyQuestionFromClipBoard(testMapPartial);
      expect(dataFromClipboard.occupiedBeds.childrenNumberOfBeds).toBeUndefined();
      expect(dataFromClipboard.occupiedBeds.adultsNumberOfBeds).toBe(0);
      expect(dataFromClipboard.operableBeds.childrenNumberOfBeds).toBeUndefined();
      expect(dataFromClipboard.operableBeds.adultsNumberOfBeds).toBe(6);
    });
  });
});
