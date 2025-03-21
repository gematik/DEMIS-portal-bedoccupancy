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



import { ContactPointInfo } from 'src/api/notification';
import ContactTypeEnum = ContactPointInfo.ContactTypeEnum;
import UsageEnum = ContactPointInfo.UsageEnum;

export const defaultContacts: Array<ContactPointInfo> = [
  {
    contactType: ContactTypeEnum.Phone,
    usage: UsageEnum.Work,
    value: '',
  },
  {
    contactType: ContactTypeEnum.Email,
    value: '',
  },
];

export const defaultNotifierFacility = {
  facilityInfo: {
    institutionName: '',
    bsnr: '',
    existsBsnr: true,
  },
  address: {
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    country: 'DE', // GERMANY_COUNTRY_CODE is ignored
    additionalInfo: null,
  },
  contact: {
    salutation: null,
    lastname: '',
    firstname: '',
  },
  contacts: defaultContacts,
};

export function hasContacts(notifierFacility: any) {
  return notifierFacility && notifierFacility.contacts && Array.isArray(notifierFacility.contacts) && notifierFacility.contacts.length != 0;
}

export function mapModelForPersonContacts(modelToBeMapped: any, model: any) {
  if (model) {
    modelToBeMapped = model.notifiedPerson;
    modelToBeMapped.contacts.phoneNumbers = model.notifiedPerson.contacts.filter((m: any) => m.contactType == 'phone');
    modelToBeMapped.contacts.emailAddresses = model.notifiedPerson.contacts.filter((m: any) => m.contactType == 'email');
  }
  return modelToBeMapped;
}
