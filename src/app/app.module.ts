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
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyModule } from '@ngx-formly/core';
import { defaultAppearanceExtension, defaultPlaceholderExtension } from './shared/formly-extensions';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

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
    FormlyModule.forRoot({
      extensions: [
        {
          name: 'default-placeholder',
          extension: defaultPlaceholderExtension,
        },
        {
          name: 'default-appearance',
          extension: defaultAppearanceExtension,
        },
      ],
    }),
  ],
  providers: [IconLoaderService, provideHttpClient(withInterceptorsFromDi()), JwtHelperService, { provide: JWT_OPTIONS, useValue: {} }],
})
export class AppModule {}
