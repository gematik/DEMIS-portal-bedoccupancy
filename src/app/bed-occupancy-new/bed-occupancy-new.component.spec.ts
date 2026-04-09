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

import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockedComponentFixture, MockProvider, MockRender } from 'ng-mocks';
import { BedOccupancyNewComponent } from './bed-occupancy-new.component';
import { BedOccupancyNotificationService } from './bed-occupancy-notification.service';
import { BedOccupancyClipboardDataService } from '../bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { bedOccupancyDummyData } from '../bed-occupancy/common/dummyData';
import { BedOccupancyQuestion } from 'src/api/notification';
import { BedOccupancyQuestionClipboard } from '../bed-occupancy/services/clipboard/clipboard-enums';

describe('BedOccupancyNewComponent', () => {
  let component: BedOccupancyNewComponent;
  let fixture: MockedComponentFixture<BedOccupancyNewComponent, BedOccupancyNewComponent>;
  let notificationService: BedOccupancyNotificationService;
  let clipboardDataService: BedOccupancyClipboardDataService;

  beforeEach(() => {
    return MockBuilder(BedOccupancyNewComponent).provide(MockProvider(BedOccupancyNotificationService)).provide(MockProvider(BedOccupancyClipboardDataService));
  });

  beforeEach(() => {
    fixture = MockRender(BedOccupancyNewComponent);
    component = fixture.point.componentInstance;
    notificationService = TestBed.inject(BedOccupancyNotificationService);
    clipboardDataService = TestBed.inject(BedOccupancyClipboardDataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClipboardDataPasted', () => {
    it('should extract data from clipboard and patch form data', () => {
      // Arrange
      const clipboardData = new Map<string, string>([
        [BedOccupancyQuestionClipboard.ADULTS_OCCUPIED, '10'],
        [BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED, '5'],
      ]);
      const extractedData: BedOccupancyQuestion = {
        occupiedBeds: {
          adultsNumberOfBeds: 10,
          childrenNumberOfBeds: 5,
        },
        operableBeds: {
          adultsNumberOfBeds: 20,
          childrenNumberOfBeds: 10,
        },
      };
      const getBedOccupancyQuestionSpy = spyOn(clipboardDataService, 'getBedOccupancyQuestionFromClipBoard').and.returnValue(extractedData);
      const patchFormDataSpy = spyOn(notificationService, 'patchFormData');

      // Act
      component.onClipboardDataPasted(clipboardData);

      // Assert
      expect(getBedOccupancyQuestionSpy).toHaveBeenCalledWith(clipboardData);
      expect(patchFormDataSpy).toHaveBeenCalledWith({
        bedOccupancyQuestion: extractedData,
      });
    });

    it('should handle empty clipboard data', () => {
      // Arrange
      const clipboardData = new Map<string, string>();
      const extractedData: BedOccupancyQuestion = {
        occupiedBeds: {
          adultsNumberOfBeds: undefined,
          childrenNumberOfBeds: undefined,
        },
        operableBeds: {},
      };
      spyOn(clipboardDataService, 'getBedOccupancyQuestionFromClipBoard').and.returnValue(extractedData);
      const patchFormDataSpy = spyOn(notificationService, 'patchFormData');

      // Act
      component.onClipboardDataPasted(clipboardData);

      // Assert
      expect(patchFormDataSpy).toHaveBeenCalledWith({
        bedOccupancyQuestion: extractedData,
      });
    });

    it('should handle partial clipboard data', () => {
      // Arrange
      const clipboardData = new Map<string, string>([[BedOccupancyQuestionClipboard.ADULTS_OCCUPIED, '15']]);
      const extractedData: BedOccupancyQuestion = {
        occupiedBeds: {
          adultsNumberOfBeds: 15,
          childrenNumberOfBeds: undefined,
        },
        operableBeds: {},
      };
      spyOn(clipboardDataService, 'getBedOccupancyQuestionFromClipBoard').and.returnValue(extractedData);
      const patchFormDataSpy = spyOn(notificationService, 'patchFormData');

      // Act
      component.onClipboardDataPasted(clipboardData);

      // Assert
      expect(patchFormDataSpy).toHaveBeenCalledWith({
        bedOccupancyQuestion: extractedData,
      });
    });
  });

  describe('handleHexHexChange', () => {
    it('should patch form data with dummy data', () => {
      // Arrange
      const patchFormDataSpy = spyOn(notificationService, 'patchFormData');

      // Act
      component.handleHexHexChange();

      // Assert
      expect(patchFormDataSpy).toHaveBeenCalledWith({
        notifierFacility: bedOccupancyDummyData.notifierFacility,
        bedOccupancyQuestion: bedOccupancyDummyData.bedOccupancyQuestion,
      });
    });

    it('should call patchFormData exactly once', () => {
      // Arrange
      const patchFormDataSpy = spyOn(notificationService, 'patchFormData');

      // Act
      component.handleHexHexChange();

      // Assert
      expect(patchFormDataSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stepsMap', () => {
    it('should create a map with correct number of steps', () => {
      // Act
      const stepsMap = component['stepsMap']();

      // Assert
      expect(stepsMap).toBeInstanceOf(Map);
      expect(stepsMap.size).toBe(2);
    });

    it('should map steps to their content components', () => {
      // Act
      const stepsMap = component['stepsMap']();

      // Assert
      expect(stepsMap.size).toBe(2);
      const steps = Array.from(stepsMap.keys());
      expect(steps[0].key).toBe('notifierFacility');
      expect(steps[1].key).toBe('bedOccupancyQuestion');
    });
  });

  describe('services injection', () => {
    it('should inject BedOccupancyNotificationService', () => {
      expect(component.bedOccupancyNotificationService).toBeTruthy();
      expect(component.bedOccupancyNotificationService).toBe(notificationService);
    });

    it('should inject BedOccupancyClipboardDataService', () => {
      expect(component.bedOccupancyClipboardDataService).toBeTruthy();
      expect(component.bedOccupancyClipboardDataService).toBe(clipboardDataService);
    });
  });
});
