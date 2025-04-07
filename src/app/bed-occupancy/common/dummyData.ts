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
