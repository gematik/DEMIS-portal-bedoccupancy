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

import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { WrapperComponent } from './wrapper.component';
import { BedOccupancyNewComponent } from '../bed-occupancy-new/bed-occupancy-new.component';
import { BedOccupancyComponent } from '../bed-occupancy/bed-occupancy.component';
import { environment } from '../../environments/environment';
import { beforeEach, describe, expect, it } from 'vitest';

describe('WrapperComponent', () => {
  let component: WrapperComponent;
  let fixture: MockedComponentFixture<WrapperComponent, WrapperComponent>;

  describe('with feature flag enabled', () => {
    beforeEach(() => {
      // Setup environment with feature flag enabled
      if (!environment.bedOccupancyConfig) {
        environment.bedOccupancyConfig = { featureFlags: {} } as any;
      }
      if (!environment.bedOccupancyConfig.featureFlags) {
        environment.bedOccupancyConfig.featureFlags = {} as any;
      }
      environment.bedOccupancyConfig.featureFlags.FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV = true;

      return MockBuilder(WrapperComponent).mock(BedOccupancyNewComponent).mock(BedOccupancyComponent);
    });

    beforeEach(() => {
      fixture = MockRender(WrapperComponent);
      component = fixture.point.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return true for isPortalBedOccupancySidenavEnabled', () => {
      expect(component.isPortalBedOccupancySidenavEnabled).toBe(true);
    });

    it('should render BedOccupancyNewComponent when feature flag is enabled', () => {
      const bedOccupancyNew = ngMocks.find(fixture, BedOccupancyNewComponent, null);
      expect(bedOccupancyNew).toBeTruthy();
    });

    it('should not render BedOccupancyComponent when feature flag is enabled', () => {
      const bedOccupancy = ngMocks.find(fixture, BedOccupancyComponent, null);
      expect(bedOccupancy).toBeNull();
    });
  });

  describe('with feature flag disabled', () => {
    beforeEach(() => {
      // Setup environment with feature flag disabled
      if (!environment.bedOccupancyConfig) {
        environment.bedOccupancyConfig = { featureFlags: {} } as any;
      }
      if (!environment.bedOccupancyConfig.featureFlags) {
        environment.bedOccupancyConfig.featureFlags = {} as any;
      }
      environment.bedOccupancyConfig.featureFlags.FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV = false;

      return MockBuilder(WrapperComponent).mock(BedOccupancyNewComponent).mock(BedOccupancyComponent);
    });

    beforeEach(() => {
      fixture = MockRender(WrapperComponent);
      component = fixture.point.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return false for isPortalBedOccupancySidenavEnabled', () => {
      expect(component.isPortalBedOccupancySidenavEnabled).toBe(false);
    });

    it('should render BedOccupancyComponent when feature flag is disabled', () => {
      const bedOccupancy = ngMocks.find(fixture, BedOccupancyComponent, null);
      expect(bedOccupancy).toBeTruthy();
    });

    it('should not render BedOccupancyNewComponent when feature flag is disabled', () => {
      const bedOccupancyNew = ngMocks.find(fixture, BedOccupancyNewComponent, null);
      expect(bedOccupancyNew).toBeNull();
    });
  });

  describe('with feature flag undefined', () => {
    beforeEach(() => {
      // Setup environment with feature flag undefined
      if (environment.bedOccupancyConfig?.featureFlags) {
        delete environment.bedOccupancyConfig.featureFlags.FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV;
      }

      return MockBuilder(WrapperComponent).mock(BedOccupancyNewComponent).mock(BedOccupancyComponent);
    });

    beforeEach(() => {
      fixture = MockRender(WrapperComponent);
      component = fixture.point.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return falsy for isPortalBedOccupancySidenavEnabled when undefined', () => {
      expect(component.isPortalBedOccupancySidenavEnabled).toBeFalsy();
    });

    it('should render BedOccupancyComponent when feature flag is undefined', () => {
      const bedOccupancy = ngMocks.find(fixture, BedOccupancyComponent, null);
      expect(bedOccupancy).toBeTruthy();
    });

    it('should not render BedOccupancyNewComponent when feature flag is undefined', () => {
      const bedOccupancyNew = ngMocks.find(fixture, BedOccupancyNewComponent, null);
      expect(bedOccupancyNew).toBeNull();
    });
  });
});
