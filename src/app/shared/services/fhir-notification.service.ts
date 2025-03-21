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



import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BedOccupancy, Notification } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import NotificationTypeEnum = Notification.NotificationTypeEnum;
import { trimStrings } from '@gematik/demis-portal-core-library';
@Injectable({
  providedIn: 'root',
})
export abstract class FhirNotificationService {
  constructor(
    protected httpClient: HttpClient,
    protected logger: NGXLogger
  ) {}

  sendNotification(notification: Notification) {
    // https://service.gematik.de/browse/DSC2-4453  Anforderung 2
    const trimmedNotification: Notification = trimStrings(notification);

    switch (trimmedNotification.notificationType) {
      case NotificationTypeEnum.BedOccupancy:
        return this.confirmSendBedOccupancyNotification(trimmedNotification.bedOccupancy);
      default:
        this.logger.error('Unbekannter Meldungstyp: ', trimmedNotification);
        throw new Error('Unknown notification type: ' + JSON.stringify(trimmedNotification));
    }
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
