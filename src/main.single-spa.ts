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

import { enableProdMode, importProvidersFrom, NgZone, provideZoneChangeDetection } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterModule } from '@angular/router';

import { getSingleSpaExtraProviders, singleSpaAngular } from 'single-spa-angular';

import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { AppProps } from 'single-spa';
import { setPublicPath } from 'systemjs-webpack-interop';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideFormlyCore } from '@ngx-formly/core';
import { defaultAppearanceExtension, defaultPlaceholderExtension } from './app/shared/formly-extensions';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BedOccupancyModule } from './app/bed-occupancy/bed-occupancy.module';
import { SharedModule } from './app/shared/shared.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoggerModule } from 'ngx-logger';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/shared/auth.interceptor';

const appId = 'notification-portal-mf-bed-occupancy';

if (environment.isProduction) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return bootstrapApplication(AppComponent, {
      providers: [
        provideZoneChangeDetection(),
        importProvidersFrom(
          RouterModule,
          RouterLink,
          BrowserModule,
          AppRoutingModule,
          ReactiveFormsModule,
          BedOccupancyModule,
          SharedModule,
          MatFormFieldModule,
          LoggerModule.forRoot(environment.defaultNgxLoggerConfig)
        ),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        getSingleSpaExtraProviders(),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: {} },
        provideFormlyCore([
          {
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
          },
        ]),
      ],
    });
  },
  template: '<bed-occupancy-root />',
  Router,
  NgZone,
  NavigationStart,
});

function init() {
  setPublicPath(appId);

  return fetch(environment.pathToEnvironment)
    .then(response => response.json())
    .then(config => {
      environment.bedOccupancyConfig = config;

      if (environment.isProduction) {
        enableProdMode();
      }
    });
}

function bootstrapFn(props: AppProps) {
  return init().then(() => {
    if (typeof lifecycles.bootstrap == 'function') {
      return lifecycles.bootstrap(props);
    } else {
      return lifecycles.bootstrap;
    }
  });
}

export const bootstrap = bootstrapFn;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
