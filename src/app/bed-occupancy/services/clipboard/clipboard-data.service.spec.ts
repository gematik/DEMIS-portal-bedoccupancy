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

import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { ClipboardDataService } from './clipboard-data.service';
import { ClipboardErrorTexts, NotifierFacilityClipboard } from './clipboard-enums';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { NGXLogger } from 'ngx-logger';

interface ClipboardStub {
  readText: jasmine.Spy<() => Promise<string>>;
  writeText: jasmine.Spy<(data: string) => Promise<void>>;
}

describe('ClipboardDataService', () => {
  let service: ClipboardDataService;
  let logger: NGXLogger;
  let messageDialogService: jasmine.SpyObj<MessageDialogService>;
  let clipboardStub: ClipboardStub;
  let originalClipboardDescriptor: PropertyDescriptor | undefined;

  beforeAll(() => {
    originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

    clipboardStub = {
      readText: jasmine.createSpy('readText').and.returnValue(Promise.resolve('')),
      writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve()),
    };

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      get: () => clipboardStub as unknown as Clipboard,
    });
  });

  afterAll(() => {
    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    }
  });

  beforeEach(() => {
    messageDialogService = jasmine.createSpyObj<MessageDialogService>('MessageDialogService', ['showErrorDialogInsertDataFromClipboard']);

    clipboardStub.readText.calls.reset();
    clipboardStub.writeText.calls.reset();

    TestBed.configureTestingModule({
      imports: [MatDialogModule, LoggerTestingModule],
      providers: [{ provide: MessageDialogService, useValue: messageDialogService }],
    });

    service = TestBed.inject(ClipboardDataService);
    logger = TestBed.inject(NGXLogger);
    spyOn(logger, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateClipBoardData', () => {
    it('sollte bei Clipboard-Fehler Dialog und Logging auslösen', fakeAsync(() => {
      clipboardStub.readText.and.returnValue(Promise.reject('boom'));
      let result: Map<string, string> | null | undefined;

      service.validateClipBoardData().subscribe(res => (result = res));
      flushMicrotasks();

      expect(messageDialogService.showErrorDialogInsertDataFromClipboard).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(ClipboardErrorTexts.CLIPBOARD_ERROR + 'boom');
      expect(result).toEqual(new Map<string, string>());
    }));

    it('sollte bei leerer Map trotz Daten Fehlerdialog zeigen', fakeAsync(() => {
      clipboardStub.readText.and.returnValue(Promise.resolve('URL data'));
      const convertSpy = spyOn(service, 'convertClipBoardDataToMap').and.returnValue(new Map());
      let result: Map<string, string> | null | undefined;

      service.validateClipBoardData().subscribe(res => (result = res));
      flushMicrotasks();

      expect(convertSpy).toHaveBeenCalledTimes(1);
      expect(clipboardStub.writeText).not.toHaveBeenCalled();
      expect(messageDialogService.showErrorDialogInsertDataFromClipboard).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    }));
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
});
