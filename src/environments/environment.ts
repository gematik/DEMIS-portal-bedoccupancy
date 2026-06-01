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
import { assetUrl } from '../single-spa/asset-url';
import { isDevMode } from '@angular/core';
import { LOGGER_CONFIG_FOR_DEV, LOGGER_CONFIG_FOR_PROD } from '@gematik/demis-portal-core-library';

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

  public get defaultLoggerConfiguration() {
    return isDevMode() ? LOGGER_CONFIG_FOR_DEV : LOGGER_CONFIG_FOR_PROD;
  }

  /**
   * Logger is by default disabled (values.yaml)
   * Locally it is by default enabled (environment.json)
   *
   * If values yaml & environment.json do not provide a logger configuration, the default configuration is used,
   * which is disabled for production and enabled for development.
   *
   * To enable or disable it differently on a specific environment, it must be changed via config maps
   *
   * Logger config hierarchy:
   * values.yaml > environment.json > defaultConfig
   */
  public get ngxLoggerConfig(): NgxLoggerConfig {
    return this.config?.ngxLoggerConfig ? this.config?.ngxLoggerConfig : this.defaultLoggerConfiguration;
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
