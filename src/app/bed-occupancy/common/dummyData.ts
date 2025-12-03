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
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

import { GERMANY_COUNTRY_CODE } from '../../shared/common-utils';

export const bedOccupancyDummyData: any = {
  bedOccupancyQuestion: {
    occupiedBeds: {
      adultsNumberOfBeds: 10,
      childrenNumberOfBeds: 5,
    },
  },
  notifierFacility: {
    locationID: '654322',
    facilityInfo: {
      institutionName: 'Krankenhaus Melissa David TEST-ONLY',
    },
    address: {
      zip: '12346',
      country: GERMANY_COUNTRY_CODE,
      street: 'Mittelweg',
      additionalInfo: null,
      city: 'Mannheim',
      houseNumber: '28',
      addressType: 'current',
    },
    contact: {
      salutation: 'Mrs',
      prefix: 'Dr',
      firstname: 'Melderina',
      lastname: 'Melderson',
    },
    contacts: {
      phoneNumbers: [
        {
          contactType: 'phone',
          usage: 'work',
          value: '0151234567',
        },
      ],
      emailAddresses: [
        {
          contactType: 'email',
          value: 'melderina@melderson.de',
        },
      ],
    },
  },
};
