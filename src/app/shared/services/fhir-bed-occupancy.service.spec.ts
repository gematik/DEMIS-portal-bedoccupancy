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
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { MessageDialogService, SubmitDialogProps } from '@gematik/demis-portal-core-library';
import { FileService } from './file.service';
import { FhirBedOccupancyService } from './fhir-bed-occupancy.service';
import { environment } from '../../../environments/environment';
import { BedOccupancy } from 'src/api/notification';

describe('FhirBedOccupancyService', () => {
  let service: FhirBedOccupancyService;
  let httpMock: HttpTestingController;

  let messageDialogService: jasmine.SpyObj<MessageDialogService>;
  let fileService: jasmine.SpyObj<FileService>;
  let logger: jasmine.SpyObj<NGXLogger>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    environment.bedOccupancyConfig = {
      pathToGateway: '/gateway/notification/api/ng/reports/bedOccupancy',
      pathToHospitalLocations: '/services/hospital-locations',
      featureFlags: {
        FEATURE_FLAG_PORTAL_PASTEBOX: true,
      },
    };
  });

  beforeEach(() => {
    messageDialogService = jasmine.createSpyObj<MessageDialogService>('MessageDialogService', [
      'showSpinnerDialog',
      'closeSpinnerDialog',
      'showSubmitDialog',
      'showErrorDialog',
      'extractMessageFromError',
    ]);
    fileService = jasmine.createSpyObj<FileService>('FileService', ['getFileNameByNotificationType']);
    logger = jasmine.createSpyObj<NGXLogger>('NGXLogger', ['error']);
    matDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        FhirBedOccupancyService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: MessageDialogService, useValue: messageDialogService },
        { provide: FileService, useValue: fileService },
        { provide: NGXLogger, useValue: logger },
        { provide: MatDialog, useValue: matDialog },
      ],
    });

    service = TestBed.inject(FhirBedOccupancyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post notification and show submit dialog on success', () => {
    const notification = {} as unknown as BedOccupancy;
    const mockFileName = 'bed-occupancy.pdf';
    const mockResponseBody = {
      content: 'BASE64CONTENT',
      authorEmail: 'author@example.org',
      notificationId: 'id-123',
      timestamp: '2025-01-01T00:00:00Z',
    };
    fileService.getFileNameByNotificationType.and.returnValue(mockFileName);

    service.submitNotification(notification);

    const req = httpMock.expectOne(environment.pathToBedOccupancy);
    expect(req.request.method).toBe('POST');
    expect(typeof req.request.body).toBe('string');

    req.flush(mockResponseBody, { status: 200, statusText: 'OK' });

    expect(messageDialogService.showSpinnerDialog).toHaveBeenCalled();
    expect(messageDialogService.closeSpinnerDialog).toHaveBeenCalled();

    expect(fileService.getFileNameByNotificationType).toHaveBeenCalledWith(notification);

    expect(messageDialogService.showSubmitDialog).toHaveBeenCalledTimes(1);
    const submitArg = messageDialogService.showSubmitDialog.calls.mostRecent().args[0] as SubmitDialogProps;
    expect(submitArg.authorEmail).toBe(mockResponseBody.authorEmail);
    expect(submitArg.fileName).toBe(mockFileName);
    expect(submitArg.notificationId).toBe(mockResponseBody.notificationId);
    expect(submitArg.timestamp).toBe(mockResponseBody.timestamp);
    expect(submitArg.href).toBe('data:application/actet-stream;base64,' + encodeURIComponent(mockResponseBody.content));
  });

  it('should show error dialog with validation errors on error response', () => {
    const notification = {} as unknown as BedOccupancy;

    service.submitNotification(notification);

    const req = httpMock.expectOne(environment.pathToBedOccupancy);
    expect(req.request.method).toBe('POST');

    const validationErrors = [{ message: 'Field A missing' }, { message: 'Field B invalid' }];
    req.flush(
      { validationErrors },
      {
        status: 400,
        statusText: 'Bad Request',
      }
    );

    expect(logger.error).toHaveBeenCalled();
    expect(messageDialogService.closeSpinnerDialog).toHaveBeenCalled();

    expect(messageDialogService.showErrorDialog).toHaveBeenCalledTimes(1);
    const errorArg = messageDialogService.showErrorDialog.calls.mostRecent().args[0] as {
      errorTitle: string;
      errors: { text: string; queryString: string }[];
    };
    expect(errorArg.errorTitle).toContain('Meldung konnte nicht zugestellt werden');
    expect(errorArg.errors.length).toBe(2);
    expect(errorArg.errors[0].text).toBe('Field A missing');
    expect(errorArg.errors[1].text).toBe('Field B invalid');
  });

  it('should show error dialog with extracted message when no validation errors', () => {
    const notification = {} as unknown as BedOccupancy;
    const errorMessage = 'Es ist ein Fehler aufgetreten';
    messageDialogService.extractMessageFromError.and.returnValue(errorMessage);

    service.submitNotification(notification);

    const req = httpMock.expectOne(environment.pathToBedOccupancy);
    expect(req.request.method).toBe('POST');

    req.flush(
      { any: 'payload' },
      {
        status: 500,
        statusText: 'Server Error',
      }
    );

    expect(logger.error).toHaveBeenCalled();
    expect(messageDialogService.closeSpinnerDialog).toHaveBeenCalled();

    expect(messageDialogService.showErrorDialog).toHaveBeenCalledTimes(1);
    const errorArg = messageDialogService.showErrorDialog.calls.mostRecent().args[0] as {
      errorTitle: string;
      errors: { text: string; queryString: string }[];
    };
    expect(errorArg.errors.length).toBe(1);
    expect(errorArg.errors[0].text).toBe(errorMessage);
  });
});
