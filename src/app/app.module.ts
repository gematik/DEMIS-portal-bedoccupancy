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
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink, RouterModule } from '@angular/router';
import { IconLoaderService } from 'src/app/shared/services/icon-loader.service';
import { LoggerModule } from 'ngx-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BedOccupancyModule } from './bed-occupancy/bed-occupancy.module';
import { EmptyrouteComponent } from './emptyroute/emptyroute.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [AppComponent, EmptyrouteComponent],
  bootstrap: [AppComponent],
  imports: [
    RouterModule,
    RouterLink,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BedOccupancyModule,
    SharedModule,
    BrowserAnimationsModule,
    BedOccupancyModule,
    MatFormFieldModule,
    LoggerModule.forRoot(environment.defaultNgxLoggerConfig),
  ],
  providers: [
    IconLoaderService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
