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

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BedOccupancy } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { trimStrings } from '@gematik/demis-portal-core-library';

@Injectable({
  providedIn: 'root',
})
export abstract class FhirNotificationService {
  protected httpClient = inject(HttpClient);
  protected logger = inject(NGXLogger);

  sendNotification(notification: BedOccupancy) {
    // https://service.gematik.de/browse/DSC2-4453  Anforderung 2
    const trimmedNotification: BedOccupancy = trimStrings(notification);
    return this.confirmSendBedOccupancyNotification(trimmedNotification);
  }

  private confirmSendBedOccupancyNotification(bedOccupancy: BedOccupancy): Observable<HttpResponse<any>> {
    return this.httpClient.post(environment.pathToBedOccupancy, JSON.stringify(bedOccupancy), {
      headers: FhirNotificationService.getHeaders(),
      observe: 'response',
    });
  }

  private static getHeaders(): HttpHeaders {
    return environment.headers;
  }
}
