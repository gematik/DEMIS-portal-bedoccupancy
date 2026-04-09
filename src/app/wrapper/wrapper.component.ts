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

import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { BedOccupancyNewComponent } from '../bed-occupancy-new/bed-occupancy-new.component';
import { BedOccupancyComponent } from '../bed-occupancy/bed-occupancy.component';

@Component({
  selector: 'app-wrapper',
  imports: [BedOccupancyNewComponent, BedOccupancyComponent],
  template: `@if (isPortalBedOccupancySidenavEnabled) {
      <app-bed-occupancy-new></app-bed-occupancy-new>
    } @else {
      <app-bed-occupancy></app-bed-occupancy>
    }`,
  standalone: true,
})
export class WrapperComponent {
  get isPortalBedOccupancySidenavEnabled() {
    return environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV;
  }
}
