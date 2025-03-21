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



import { Injectable } from '@angular/core';
import {
  ContactPointInfo,
  FacilityAddressInfo,
  FacilityInfo,
  NotifiedPerson,
  NotifiedPersonAddressInfo,
  NotifierFacility,
  PractitionerInfo,
} from 'src/api/notification';
import { GERMANY_COUNTRY_CODE } from '../common-utils';
import {
  checkAdditionalInfoText,
  isEndDateLaterThanStartDate,
  termValidation,
  validateBSNR,
  validateDateInput,
  validateEmail,
  validateGermanZip,
  validateHouseNumber,
  validateInternationalZip,
  validateName,
  validateNotBlank,
  validatePartialDateInput,
  validatePhoneNo,
  validateStreet,
} from '../notification-form-validation-module';
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
  constructor() {}

  validateNotifierFacility(notifierFacility: NotifierFacility, requiredBsNr = true): boolean {
    return (
      !!notifierFacility &&
      this.validatePractitionerInfo(notifierFacility.contact) &&
      this.validateGermanAddress(notifierFacility.address) &&
      this.validateContactPointInfoFacility(notifierFacility.contacts) &&
      this.validateFacilityInfo(notifierFacility.facilityInfo, requiredBsNr)
    );
  }

  validateNotifierFacilityBedOccupancyTemp(notifierFacility: NotifierFacility): boolean {
    return (
      !!notifierFacility &&
      this.validatePractitionerInfo(notifierFacility.contact) &&
      this.validateContactPointInfoFacility(notifierFacility.contacts) &&
      this.validateGermanAddressBedOccupancyTemp(notifierFacility.address) &&
      this.validateFacilityInfoBedOccupancyTemp(notifierFacility.facilityInfo)
    );
  }

  validatePractitionerInfo(practitionerInfo: PractitionerInfo): boolean {
    return !!practitionerInfo && this.validateString(practitionerInfo.firstname, true) && this.validateString(practitionerInfo.lastname, true);
  }

  validateString(term: string | undefined, required: boolean): boolean {
    return required ? !!term && !termValidation(term) && !validateNotBlank(term) : !term || !termValidation(term);
  }

  validateStreet(term: string | undefined, required: boolean): boolean {
    return required ? !!term && !validateStreet(term) && !validateNotBlank(term) : !term || !validateStreet(term);
  }

  validateName(term: string, required: boolean): boolean {
    return required ? !!term && !validateName(term) : !term || !validateName(term);
  }

  isAdditionalInfoTextValid(term: string | undefined, required: boolean): boolean {
    return required ? !!term && !checkAdditionalInfoText(term) : !term || !checkAdditionalInfoText(term);
  }

  validateZipCode(zip: string, countryCode?: string): boolean {
    return countryCode === GERMANY_COUNTRY_CODE ? !!zip && !validateGermanZip(zip) : !!zip && !validateInternationalZip(zip);
  }

  validateHouseNumber(houseNumber: string | undefined, required: boolean): boolean {
    return required ? !!houseNumber && !validateHouseNumber(houseNumber) : !houseNumber || !validateHouseNumber(houseNumber);
  }

  validateDate(date: string | undefined, required: boolean): boolean {
    return required ? !!date && !validateDateInput(date) : !date || !validateDateInput(date);
  }

  validateBsNr(facilityInfo: FacilityInfo): boolean {
    return !!facilityInfo?.existsBsnr ? !!facilityInfo.bsnr && !validateBSNR(facilityInfo.bsnr) : true;
  }

  validateFacilityInfoBedOccupancyTemp(facilityInfo: FacilityInfo) {
    return !!facilityInfo && !!facilityInfo.institutionName;
  }

  validateGermanAddress(address: FacilityAddressInfo): boolean {
    return (
      !!address &&
      this.validateStreet(address.street, true) &&
      this.validateHouseNumber(address.houseNumber, true) &&
      this.validateZipCode(address.zip, GERMANY_COUNTRY_CODE) &&
      this.validateString(address.city, true) &&
      !!address.country
    );
  }

  validateGermanAddressBedOccupancyTemp(address: FacilityAddressInfo): boolean {
    return !!address && !!address.street && !!address.houseNumber && !!address.zip && !!address.city && !!address.country;
  }

  validateInternationalAddress(address: NotifiedPersonAddressInfo | undefined): boolean {
    return (
      !!address &&
      this.validateStreet(address.street, false) &&
      this.validateHouseNumber(address.houseNumber, false) &&
      this.validateZipCode(address.zip) &&
      this.validateString(address.city, false) &&
      !!address.country
    );
  }

  validatePhoneNumber(phoneNumber: string, required: boolean): boolean {
    return required ? !!phoneNumber && !validatePhoneNo(phoneNumber) : !phoneNumber || !validatePhoneNo(phoneNumber);
  }

  validateEmailAddress(email: string, required: boolean): boolean {
    return required ? !!email && !validateEmail(email) : !email || !validateEmail(email);
  }

  validateContactPointInfoFacility(contactPointInfo: ContactPointInfo[]): boolean {
    return contactPointInfo.length > 0 && this.validateContacts(contactPointInfo);
  }

  validateContactPointInfoNotifiedPerson(contactPointInfo: ContactPointInfo[] | undefined): boolean {
    return !contactPointInfo || this.validateContacts(contactPointInfo);
  }

  validateContacts(contactPointInfos: ContactPointInfo[] | undefined): boolean {
    if (!contactPointInfos) return true;
    let result: boolean = true;
    contactPointInfos.forEach((contact: ContactPointInfo) => {
      if (contact.contactType === ContactTypeEnum.Phone && !this.validatePhoneNumber(contact.value, true)) {
        return (result = false);
      } else if (contact.contactType === ContactTypeEnum.Email && !this.validateEmailAddress(contact.value, true)) {
        return (result = false);
      }
    });
    return result;
  }

  validateFacilityInfo(facilityInfo: FacilityInfo, requiredBsNr: boolean) {
    if (!this.validateString(facilityInfo.institutionName, true)) return false;
    if (validateNotBlank(facilityInfo.institutionName)) return false;
    if (requiredBsNr && !this.validateBsNr(facilityInfo)) return false;
    return true;
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
