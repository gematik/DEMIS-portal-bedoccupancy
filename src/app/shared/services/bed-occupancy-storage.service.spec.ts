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

import { BedOccupancyStorageService } from './bed-occupancy-storage.service';
import { MockBuilder } from 'ng-mocks';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('BedOccupancyStorageService', () => {
  let service: BedOccupancyStorageService;
  let windowTokenSpy: jasmine.Spy;

  beforeEach(() => MockBuilder(BedOccupancyStorageService).provide([provideHttpClient(withInterceptorsFromDi()), JwtHelperService]));

  beforeEach(() => {
    service = TestBed.inject(BedOccupancyStorageService);

    windowTokenSpy = jasmine.createSpy('windowToken');
    Object.defineProperty(window, 'token', {
      get: windowTokenSpy,
      configurable: true,
    });
  });

  afterEach(() => {
    delete (window as any)['token'];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decode valid jwt', () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpayI6IjEyMzQ1Njc4OSJ9.mock-signature';

    windowTokenSpy.and.returnValue(mockToken);

    const result = service.getIkNumber();

    expect(windowTokenSpy).toHaveBeenCalled();
    expect(result).toBe('123456789');
  });

  it('should decode valid jwt with special characters in payload', () => {
    const mockToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InhDVGg1YnJicWx3cEo5Z0g3RF9xTWppZXA2b2xXa3dWeE82NG9aVENYQU0ifQ.eyJleHAiOjE3NTI0NzQ2NjUsImlhdCI6MTc1MjQ3NDM2NSwiYXV0aF90aW1lIjoxNzUyNDc0MzY0LCJqdGkiOiJvbnJ0YWM6MGE1ZWJlZjItOTFiMC00NjM1LTk1MGMtY2Q0YjUxZTA4NTBiIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmRlbWlzLnJraS5kZS9yZWFsbXMvUE9SVEFMIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjM4N2E0Mjk2LWYxOGUtNGFkNC1hYTQ5LTc2ZWU4Yzc0MjFkYiIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1lbGRlcG9ydGFsIiwic2lkIjoiODAwZTUyZjctOTFkYy00ZjY0LThhM2EtYjEzMWQyNjlkODdjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3BvcnRhbC5kZW1pcy5ya2kuZGUiLCJodHRwczovL21lbGR1bmcuZGVtaXMucmtpLmRlIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJiZWQtb2NjdXBhbmN5LXNlbmRlciIsImRpc2Vhc2Utbm90aWZpY2F0aW9uLXNlbmRlciIsIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1wb3J0YWwiLCJ1bWFfYXV0aG9yaXphdGlvbiIsInBhdGhvZ2VuLW5vdGlmaWNhdGlvbi1zZW5kZXIiLCJ2YWNjaW5lLWluanVyeS1zZW5kZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJpayI6IjI2MDMyMTQ5NSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJvZmVzc2lvbk9pZCI6IjEuMi4yNzYuMC43Ni40LjUzIiwib3JnYW5pemF0aW9uTmFtZSI6ImE_IiwiYWNjb3VudFR5cGUiOiJvcmdhbnppYXRpb24iLCJhY2NvdW50U291cmNlIjoiZ2VtYXRpayIsImFjY291bnRJc1RlbXBvcmFyeSI6dHJ1ZSwiYWNjb3VudElkZW50aWZpZXIiOiJodHRwczovL2dlbWF0aWsuZGUvZmhpci9zaWQvdGVsZW1hdGlrLWlkfDUtMi0xMjM0NTY3ODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI1LTItMTIzNDU2Nzg5IiwidXNlcm5hbWUiOiI1LTItMTIzNDU2Njc4OSJ9.Qozc6N4-EW2K9HtexdqlfiaM8EwmD4SlOqhgPXBqEACQv2N52RLDQSTHsbc08sdRtmgkwIs1BtRPaLcPkaowBbogvMYzSfKX4evow97l0NOiPpVyqOc67rpXljQ6RZFZ7oQZxKp7kGFhvHcb6ifOaQdFCgtpXzoNtUeef_WIBwIKrla0vznofDylEwJxPrCdFs6OKR4UEm0CwP24D_g5KFooHlahftJdnsGjrCA42RXO2eIsRGnRS3CVBmXL6eP7nhbl0VcKFkccrxck5JBHn0FH2FzRyEoTVYnAFAmIPc-WjlA5TX3WOcUTDr-irh6BrYNANuwzO-n_MGAYh3sexA';

    windowTokenSpy.and.returnValue(mockToken);

    const result = service.getIkNumber();

    expect(windowTokenSpy).toHaveBeenCalled();
    expect(result).toBe('260321495');
  });
});
