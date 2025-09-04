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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SubmitNotificationDialogComponent, SubmitNotificationDialogData } from './submit-notification-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MessageDialogService } from '@gematik/demis-portal-core-library';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('SubmitNotificationDialogComponent', () => {
  // Helper to reset the TestBed after each test
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    const messageDialogServiceSpy = jasmine.createSpyObj('MessageDialogService', ['extractMessageFromError', 'showErrorDialog']);
    const fhirServiceMock = {
      sendNotification: jasmine.createSpy('sendNotification').and.returnValue({
        subscribe: () => {},
      }),
    };
    const testData: SubmitNotificationDialogData = { notification: {} as any, fhirService: fhirServiceMock as any };

    TestBed.configureTestingModule({
      declarations: [SubmitNotificationDialogComponent],
      imports: [LoggerTestingModule, MatIconModule, MatExpansionModule, MatTableModule, MatProgressSpinnerModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        { provide: MessageDialogService, useValue: messageDialogServiceSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SubmitNotificationDialogComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call showErrorDialog when feature flag is true', fakeAsync(() => {
    environment.bedOccupancyConfig = {
      featureFlags: { FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT: true },
    };

    const messageDialogServiceSpy = jasmine.createSpyObj('MessageDialogService', ['extractMessageFromError', 'showErrorDialog']);
    messageDialogServiceSpy.extractMessageFromError.and.returnValue('Fehlermeldungstext aus ErrorMessage');
    const fhirServiceMock = { sendNotification: jasmine.createSpy('sendNotification') };
    const testData: SubmitNotificationDialogData = { notification: {} as any, fhirService: fhirServiceMock as any };

    TestBed.configureTestingModule({
      declarations: [SubmitNotificationDialogComponent],
      imports: [LoggerTestingModule, MatIconModule, MatExpansionModule, MatTableModule, MatProgressSpinnerModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        { provide: MessageDialogService, useValue: messageDialogServiceSpy },
      ],
    }).compileComponents();

    const errorResponse = { message: 'Fehler', validationErrors: [] };
    fhirServiceMock.sendNotification.and.returnValue(throwError(() => ({ error: errorResponse })));

    const fixture = TestBed.createComponent(SubmitNotificationDialogComponent);
    fixture.detectChanges();
    tick();

    expect(messageDialogServiceSpy.extractMessageFromError).toHaveBeenCalledWith(errorResponse);
    expect(messageDialogServiceSpy.showErrorDialog).toHaveBeenCalledWith(
      jasmine.objectContaining({
        errorTitle: 'Meldung konnte nicht zugestellt werden!',
        errors: [
          jasmine.objectContaining({
            text: 'Fehlermeldungstext aus ErrorMessage',
            queryString: 'Fehlermeldungstext aus ErrorMessage',
          }),
        ],
      })
    );
  }));

  it('should set result to error when feature flag is false', () => {
    environment.bedOccupancyConfig = {
      featureFlags: { FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT: false },
    };

    const messageDialogServiceSpy = jasmine.createSpyObj('MessageDialogService', ['extractMessageFromError', 'showErrorDialog']);
    const fhirServiceMock = { sendNotification: jasmine.createSpy('sendNotification') };
    const testData: SubmitNotificationDialogData = { notification: {} as any, fhirService: fhirServiceMock as any };

    TestBed.configureTestingModule({
      declarations: [SubmitNotificationDialogComponent],
      imports: [LoggerTestingModule, MatIconModule, MatExpansionModule, MatTableModule, MatProgressSpinnerModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: testData },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        { provide: MessageDialogService, useValue: messageDialogServiceSpy },
      ],
    }).compileComponents();

    const errorResponse = { message: 'Fehler', validationErrors: [] };
    fhirServiceMock.sendNotification.and.returnValue(throwError(() => ({ error: errorResponse })));

    const fixture = TestBed.createComponent(SubmitNotificationDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.result).toBeTruthy();
    expect(component.result?.message).toContain('Es ist ein Fehler aufgetreten');
    expect(messageDialogServiceSpy.showErrorDialog).not.toHaveBeenCalled();
  });
});
