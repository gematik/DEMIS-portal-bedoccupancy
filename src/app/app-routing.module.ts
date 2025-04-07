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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';
import { EmptyrouteComponent } from './emptyroute/emptyroute.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '**',
    component: BedOccupancyComponent,
  },
  {
    path: 'test',
    component: EmptyrouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [Location, { provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
