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

import { Injectable } from '@angular/core';
import { BedOccupancy } from 'src/api/notification';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  abbreviation = '.pdf';

  constructor() {}

  /**
   * @returns current time as YYMMDDhhmmss
   */
  private getCurrentTime(): string {
    function pad2(n: number) {
      return n < 10 ? '0' + n : n;
    }

    const date = new Date();
    return (
      date.getFullYear().toString().slice(-2) +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes()) +
      pad2(date.getSeconds())
    );
  }

  /**
   * @return
   *    Hospitalization | QuickTest: YYMMDDhhmmss NACHNAME, VORNAME YYMMDD.pdf
   *    BedOccupancy: YYMMDDhhmmss STANDORTID.pdf
   *    with YYMMDDhhmmss as currentTime
   */
  getFileNameByNotificationType(notification: BedOccupancy) {
    return this.getCurrentTime() + ' ' + notification.notifierFacility.locationID + this.abbreviation;
  }
}
