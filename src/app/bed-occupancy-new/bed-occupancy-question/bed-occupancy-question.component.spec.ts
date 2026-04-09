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

import { signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { BedOccupancyQuestionComponent } from './bed-occupancy-question.component';
import { BedOccupancyNotificationService } from '../bed-occupancy-notification.service';
import { StepNavigationService } from '@gematik/demis-portal-core-library';

describe('BedOccupancyQuestionComponent', () => {
  let component: BedOccupancyQuestionComponent;
  let fixture: MockedComponentFixture<BedOccupancyQuestionComponent, BedOccupancyQuestionComponent>;
  let notificationService: BedOccupancyNotificationService;
  let navigationService: StepNavigationService;

  beforeEach(() => {
    const notificationServiceMock: Partial<BedOccupancyNotificationService> = {
      bedOccupancyQuestionModel: signal({}),
      bedOccupancyQuestionGroup: new FormGroup({}),
      sendData: jasmine.createSpy('sendData'),
      isFormValid: jasmine.createSpy('isFormValid').and.returnValue(true),
      hasBedOccupancyQuestionBeenVisited: jasmine.createSpy('hasBedOccupancyQuestionBeenVisited').and.returnValue(false),
      markBedOccupancyQuestionAsVisited: jasmine.createSpy('markBedOccupancyQuestionAsVisited'),
    };

    const navigationServiceMock: Partial<StepNavigationService> = {
      canGoToPrevious: signal(true),
      previous: jasmine.createSpy('previous'),
    };

    return MockBuilder(BedOccupancyQuestionComponent)
      .provide({
        provide: BedOccupancyNotificationService,
        useValue: notificationServiceMock,
      })
      .provide({
        provide: StepNavigationService,
        useValue: navigationServiceMock,
      });
  });

  beforeEach(() => {
    notificationService = TestBed.inject(BedOccupancyNotificationService);
    navigationService = TestBed.inject(StepNavigationService);
  });

  it('should create', () => {
    ngMocks.flushTestBed();
    fixture = MockRender(BedOccupancyQuestionComponent);
    component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should mark the component as visited after initialization', () => {
    ngMocks.flushTestBed();
    fixture = MockRender(BedOccupancyQuestionComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();
    expect(notificationService.markBedOccupancyQuestionAsVisited).toHaveBeenCalled();
  });

  it('should not mark form as touched on first visit', () => {
    (notificationService.hasBedOccupancyQuestionBeenVisited as jasmine.Spy).and.returnValue(false);
    spyOn(notificationService.bedOccupancyQuestionGroup, 'markAllAsTouched');

    ngMocks.flushTestBed();
    fixture = MockRender(BedOccupancyQuestionComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    expect(notificationService.hasBedOccupancyQuestionBeenVisited).toHaveBeenCalled();
    expect(notificationService.bedOccupancyQuestionGroup.markAllAsTouched).not.toHaveBeenCalled();
  });

  it('should mark form as touched on second visit', () => {
    (notificationService.hasBedOccupancyQuestionBeenVisited as jasmine.Spy).and.returnValue(true);
    spyOn(notificationService.bedOccupancyQuestionGroup, 'markAllAsTouched');

    ngMocks.flushTestBed();
    fixture = MockRender(BedOccupancyQuestionComponent);
    component = fixture.point.componentInstance;
    fixture.detectChanges();

    expect(notificationService.hasBedOccupancyQuestionBeenVisited).toHaveBeenCalled();
    expect(notificationService.bedOccupancyQuestionGroup.markAllAsTouched).toHaveBeenCalled();
  });
});
