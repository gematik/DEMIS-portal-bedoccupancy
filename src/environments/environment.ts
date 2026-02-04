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

import { HttpHeaders } from '@angular/common/http';
import { NgxLoggerLevel } from 'ngx-logger';
import { assetUrl } from '../single-spa/asset-url';

interface NgxLoggerConfig {
  level: number;
  disableConsoleLogging: boolean;
  serverLogLevel: number;
}

interface Configuration {
  production: boolean;
  pathToGateway: string;
  pathToHospitalLocations: string;
  ngxLoggerConfig: NgxLoggerConfig;
}

class Environment {
  public bedOccupancyConfig: any;
  public headers: HttpHeaders;

  constructor() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private get config(): Configuration {
    return this.bedOccupancyConfig;
  }

  public get pathToEnvironment() {
    return assetUrl('../environment.json');
  }

  public get isProduction(): boolean {
    return !!this.config?.production;
  }

  public get defaultNgxLoggerConfig(): NgxLoggerConfig {
    return {
      level: NgxLoggerLevel.OFF,
      disableConsoleLogging: true,
      serverLogLevel: NgxLoggerLevel.OFF,
    };
  }

  public get pathToGateway(): string {
    return this.bedOccupancyConfig.pathToGateway;
  }

  public get pathToBedOccupancy(): string {
    return this.pathToGateway;
  }

  public get pathToHospitalLocations(): string {
    return this.bedOccupancyConfig.pathToHospitalLocations;
  }
}

export const environment = new Environment();
