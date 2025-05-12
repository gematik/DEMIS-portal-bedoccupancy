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

import { TestBed } from '@angular/core/testing';

import { ContactPointInfo, FacilityAddressInfo } from 'src/api/notification';
import { ValidateNotificationService } from './validate-notification.service';
import ContactTypeEnum = ContactPointInfo.ContactTypeEnum;

export const dangerousCharArrayForStreet = ['@', '\\', '*', '?', '$', '|', '=', '´', '"', '[', ']', '{', '}', '<', '>'];

export const validSpecialCharsArrayForStreet = ["'", '.', '&', '(', ')'];

export const STREET_MAX_LENGTH = 100;

describe('ValidateNotificationTestService', () => {
  let service: ValidateNotificationService;
  const phone = ContactTypeEnum.Phone;
  const email = ContactTypeEnum.Email;
  const validPhone = '08761923';
  const validEmail = 'testerino@test.de';

  const validAddressInfo = (street: string) =>
    ({
      street,
      houseNumber: '1',
      zip: '10115',
      city: 'Berlin',
      country: 'Germany',
    }) as FacilityAddressInfo;

  const randomLiteralsString = (length: number) => Array.from({ length: length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass isAdditionalInfoTextValid for allowed characters', () => {
    const value: string = 'allowed characters like (&§"!)$';
    expect(service.isAdditionalInfoTextValid(value, false)).toBe(true);
  });

  it('should fail isAdditionalInfoTextValid fail invalid characters', () => {
    const value: string = "not allowed characters like \\ = ´ ' < >";
    expect(service.isAdditionalInfoTextValid(value, false)).toBe(false);
  });

  it('should fail validateContactPointInfoFacility when no contact points given', () => {
    expect(service.validateContactPointInfoFacility([])).toBe(false);
  });

  it('should pass validateContactPointInfoFacility when at least one contact point is given', () => {
    expect(service.validateContactPointInfoFacility([{ contactType: phone, value: validPhone }])).toBe(true);
  });

  describe('test street validation', () => {
    for (const chr of dangerousCharArrayForStreet) {
      it(`should fail validateGermanAddress on "${chr}" in street`, () => {
        expect(service.validateGermanAddress(validAddressInfo(`Test st${chr}reet`))).toBeFalsy();
      });
    }

    for (const chr of validSpecialCharsArrayForStreet) {
      it(`should succeed validateStreet on valid street if "${chr}" in street`, () => {
        expect(service.validateStreet(`Test st${chr}reet`, false)).toBeTruthy();
      });
    }

    it(`should succeed validateStreet on street length is ${STREET_MAX_LENGTH} and ${STREET_MAX_LENGTH - 1}`, () => {
      const testStreet = randomLiteralsString(STREET_MAX_LENGTH - 1);
      expect(service.validateStreet(testStreet, true)).toBeTruthy();
      expect(service.validateStreet(testStreet + 'x', true)).toBeTruthy();
    });

    it(`should fail validateStreet on street length is ${STREET_MAX_LENGTH + 1}`, () => {
      const testStreet = randomLiteralsString(STREET_MAX_LENGTH + 1);
      expect(service.validateStreet(testStreet, true)).toBeFalsy();
    });
  });

  describe('validate contacts', () => {
    const validParameters = [
      {
        description: 'should pass for valid phone only',
        input: [{ contactType: phone, value: validPhone }],
      },
      {
        description: 'should pass for valid email only',
        input: [{ contactType: email, value: validEmail }],
      },
      {
        description: 'should pass for valid phone and email',
        input: [
          { contactType: phone, value: validPhone },
          { contactType: email, value: validEmail },
        ],
      },
      {
        description: 'should pass for valid phoneNos and emails',
        input: [
          { contactType: phone, value: validPhone },
          { contactType: phone, value: validPhone },
          { contactType: email, value: validEmail },
          { contactType: email, value: validEmail },
        ],
      },
    ];
    validParameters.forEach(parameter => {
      it(parameter.description, () => {
        expect(service.validateContacts(parameter.input)).toBe(true);
      });
    });

    const shortNo = '01234';

    const inValidParameters = [
      {
        description: 'should fail for empty phone',
        input: [{ contactType: phone, value: '' }],
      },
      {
        description: 'should fail for empty email',
        input: [{ contactType: email, value: '' }],
      },
      {
        description: 'should fail for empty phone and email',
        input: [
          { contactType: phone, value: '' },
          { contactType: email, value: '' },
        ],
      },
      {
        description: 'should fail for null phone and email',
        input: [
          { contactType: phone, value: null },
          { contactType: email, value: null },
        ],
      },

      {
        description: 'should fail for invalid phone no not starting with 0',
        input: [{ contactType: phone, value: '1234567' }],
      },
      {
        description: 'should fail for invalid phone no too short',
        input: [{ contactType: phone, value: shortNo }],
      },
      {
        description: 'should fail for invalid phone no contains text',
        input: [{ contactType: phone, value: '0123456789abc' }],
      },
      {
        description: 'should fail for invalid phone no leading brackets',
        input: [{ contactType: phone, value: '(0049)1741236589' }],
      },
      {
        description: 'should fail for invalid phone text',
        input: [{ contactType: phone, value: 'test' }],
      },
      {
        description: 'should fail for email without @',
        input: [{ contactType: email, value: 'auch-ungueltig.de' }],
      },
      {
        description: 'should fail for email with _ after @',
        input: [{ contactType: email, value: '_@test_Me.too' }],
      },
      {
        description: 'should fail for email with special characters',
        input: [{ contactType: email, value: 'keinesonderzeichen´êa@ü?.djkd' }],
      },
      {
        description: 'should fail for email with more than 320 characters after @',
        input: [
          {
            contactType: email,
            value:
              'genau321Zeichen_nach_dem@Lorem-ipsum-dolor-sit-amet--consetetur-sadipscing-elitr--sed-diam-nonumy-eirmod-tempor-invidunt-ut-labore-et-dolore-magna-aliquyam-erat--sed-diam-voluptua.-At-vero-eos-et-accusam-et-justo-duo-dolores-et-ea-rebum.-Stet-clita-kasd-gubergren--no-sea-takimata-sanctus-est-Lorem-ipsum-dolor-sit-amet.-Lorem-ipsum-dolor-sit.com',
          },
        ],
      },
      {
        description: 'should fail for email as number',
        input: [{ contactType: email, value: shortNo }],
      },
      {
        description: 'should fail for email as text',
        input: [{ contactType: email, value: 'testerino' }],
      },
      {
        description: 'should fail for phone valid and email invalid',
        input: [
          { contactType: phone, value: validPhone },
          { contactType: email, value: 'testerino' },
        ],
      },
      {
        description: 'should fail for email valid and phone invalid',
        input: [
          { contactType: email, value: validEmail },
          { contactType: phone, value: shortNo },
        ],
      },
    ];
    inValidParameters.forEach(parameter => {
      it(parameter.description, () => {
        expect(service.validateContacts(parameter.input)).toBe(false);
      });
    });
  });
});
