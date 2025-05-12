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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { TestBed } from '@angular/core/testing';

import { ClipboardDataService } from './clipboard-data.service';
import { NotifierFacilityClipboard } from './clipboard-enums';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MessageDialogService } from '@gematik/demis-portal-core-library';

describe('ClipboardDataService', () => {
  let service: ClipboardDataService;

  beforeEach(() => {
    environment.bedOccupancyConfig = {
      featureFlags: {
        FEATURE_FLAG_PORTAL_ERROR_DIALOG: true,
      },
    };

    TestBed.configureTestingModule({
      imports: [MatDialogModule, LoggerTestingModule],
    });
    service = TestBed.inject(ClipboardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const familyName = 'Schulz';

  describe('convertClipBoardDataToMap', () => {
    it('should handle invalid Uri', () => {
      const validMap = service.convertClipBoardDataToMap('bla');
      expect(validMap.size).toBe(0);
    });

    it('should handle empty valid uri', () => {
      const validMap = service.convertClipBoardDataToMap('Url ');
      expect(validMap.size).toBe(0);
    });

    it('should handle uri not starting with URL', () => {
      const validMap = service.convertClipBoardDataToMap(`N.family=${familyName}`);
      expect(validMap.size).toBe(0);
    });

    it('should accept url encoded strings', () => {
      const validMap = service.convertClipBoardDataToMap('URL F.name=Meldende%20Einrichtung&F.bsnr=123456789&F.city=M%C3%BCnchen');
      expect(validMap.size).toBe(3);
      expect(validMap.get(NotifierFacilityClipboard.FACILITY_CITY)).toBe('München');
      expect(validMap.get(NotifierFacilityClipboard.FACILITY_NAME)).toBe('Meldende Einrichtung');
    });
  });

  it('openErrorDialog should call specific dialog from core library', () => {
    const showErrorDialogInsertDataFromClipboardSpy = spyOn(TestBed.inject(MessageDialogService), 'showErrorDialogInsertDataFromClipboard');
    service.openErrorDialog();
    expect(showErrorDialogInsertDataFromClipboardSpy).toHaveBeenCalled();
  });
});
