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
import { FileService } from './file.service';
import { BedOccupancy } from 'src/api/notification';

describe('FileService', () => {
  let service: FileService;
  let mockDate: Date;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);

    mockDate = new Date(2024, 2, 15, 14, 30, 45);
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create filename with locationID and current timestamp', () => {
    const mockBedOccupancy: BedOccupancy = {
      notifierFacility: {
        locationID: 'LOC123',
      },
    } as BedOccupancy;

    const expectedFileName = '240315143045 LOC123.pdf';
    expect(service.getFileNameByNotificationType(mockBedOccupancy)).toBe(expectedFileName);
  });

  it('should handle empty locationID', () => {
    const mockBedOccupancy: BedOccupancy = {
      notifierFacility: {
        locationID: '',
      },
    } as BedOccupancy;

    const expectedFileName = '240315143045 .pdf';
    expect(service.getFileNameByNotificationType(mockBedOccupancy)).toBe(expectedFileName);
  });

  it('should preserve case of locationID', () => {
    const mockBedOccupancy: BedOccupancy = {
      notifierFacility: {
        locationID: 'TestLoc456',
      },
    } as BedOccupancy;

    const expectedFileName = '240315143045 TestLoc456.pdf';
    expect(service.getFileNameByNotificationType(mockBedOccupancy)).toBe(expectedFileName);
  });
});
