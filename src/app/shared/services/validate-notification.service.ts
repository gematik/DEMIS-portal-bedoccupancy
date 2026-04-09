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

import { Injectable } from '@angular/core';
import { ContactPointInfo } from 'src/api/notification';
import { validateEmail, validatePhoneNo } from '../notification-form-validation-module';
import ContactTypeEnum = ContactPointInfo.ContactTypeEnum;

/****
 *
 * This service contains all the validation common to all types of notifications.
 * Only the validation specific to each type of notification should be implemented
 * in the services of these notifications
 *
 */

@Injectable({ providedIn: 'root' })
export class ValidateNotificationService {
  validatePhoneNumber(phoneNumber: string, required: boolean): boolean {
    return required ? !!phoneNumber && !validatePhoneNo(phoneNumber) : !phoneNumber || !validatePhoneNo(phoneNumber);
  }

  validateEmailAddress(email: string, required: boolean): boolean {
    return required ? !!email && !validateEmail(email) : !email || !validateEmail(email);
  }

  async phoneValidator(data: any): Promise<boolean> {
    const contacts: ContactPointInfo[] = await this.handelAsyncData(data);

    for (const contact of contacts) {
      if (contact.contactType === ContactTypeEnum.Phone && !this.validatePhoneNumber(contact.value, true)) {
        return false;
      }
    }

    return true;
  }

  async emailValidator(data: any): Promise<boolean> {
    const contacts: ContactPointInfo[] = await this.handelAsyncData(data);

    for (const contact of contacts) {
      if (contact.contactType === ContactTypeEnum.Email && !this.validateEmailAddress(contact.value, true)) {
        return false;
      }
    }

    return true;
  }

  private handelAsyncData(data: any): Promise<any> {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve(data.contacts);
      });
    });
  }
}
