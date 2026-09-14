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

import { FieldTypeConfig, FormlyConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { DateTime } from 'luxon';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AbstractControl } from '@angular/forms';

import {
  BLANK_ERROR_MSG,
  BSNR_ERROR_MSG,
  MINIMUM_LENGTH_NOT_REACHED,
  REQUIRED_FIELD,
  DATE_FORMAT_ERROR_MSG,
  DATE_IN_FUTURE_ERROR_MSG,
  DATE_NOT_EXIST,
  EMAIL_ERROR_MSG,
  END_DATE_LATER_THAN_START_DATE_ERROR_MSG,
  HOUSE_NBR_ERROR_MSG,
  NUMBER_OF_BEDS_ERROR_MSG,
  PARTIAL_DATE_FORMAT_ERROR_MSG,
  PHONE_ERROR_MSG,
  TEXT_ERROR_MSG,
  UI_LUXON_DATE_FORMAT,
  ZIP_GERMANY_ERROR_MSG,
  ZIP_INTERNATIONAL_ERROR_MSG,
} from './common-utils';
import {
  checkAdditionalInfoText,
  checkNumberOfBeds,
  endDateValidator,
  isEmptyOrInFutureDate,
  isEndDateLaterThanStartDate,
  isFutureDate,
  matchesRegExp,
  NotificationFormValidationModule,
  optionMatchesValidation,
  setValidationMessage,
  startDateValidator,
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
  ValidationResult,
} from './notification-form-validation-module';

type FormlyValidatorFn = (control: AbstractControl, field?: unknown, options?: unknown) => unknown;

interface FormlyValidatorEntry {
  name: string;
  validation: FormlyValidatorFn;
  options?: { required?: boolean };
}

const error = (message: string): ValidationResult => ({ fieldMatch: { message } });

const asControl = (value: unknown, parentValue?: unknown): AbstractControl =>
  ({
    value,
    parent: parentValue === undefined ? null : { value: parentValue },
  }) as unknown as AbstractControl;

const toUiDate = (date: DateTime): string => date.toFormat(UI_LUXON_DATE_FORMAT);

const TODAY = DateTime.local();
const YESTERDAY = toUiDate(TODAY.minus({ days: 1 }));
const TOMORROW = toUiDate(TODAY.plus({ days: 1 }));
const TWO_DAYS_AGO = toUiDate(TODAY.minus({ days: 2 }));

const VALIDATOR_NAMES = [
  'bsNrValidator',
  'dateInputValidator',
  'partialDateInputValidation',
  'germanZipValidator',
  'houseNumberValidator',
  'internationalZipValidator',
  'textValidator',
  'streetValidator',
  'phoneValidator',
  'emailValidator',
  'nameValidator',
  'additionalInfoTextValidator',
  'numberOfBedsValidator',
  'nonBlankValidator',
  'optionMatches',
];

describe('NotificationFormValidationModule', () => {
  let formlyConfig: FormlyConfig;

  beforeEach(() => MockBuilder().keep(NotificationFormValidationModule));

  beforeEach(() => {
    // the form builder applies the FORMLY_CONFIG providers to the FormlyConfig instance
    ngMocks.findInstance(FormlyFormBuilder);
    formlyConfig = ngMocks.findInstance(FormlyConfig);
  });

  /**
   * The validators registered in {@link NotificationFormValidationModule} are module private,
   * so they are read back from the Formly configuration to be exercised directly.
   */
  const run = (name: string, value: unknown, parentValue?: unknown): unknown => {
    const validator = formlyConfig.getValidator(name) as unknown as FormlyValidatorEntry;
    expect(validator, `validator '${name}' is not registered`).toBeDefined();
    return validator.validation(asControl(value, parentValue), undefined, validator.options ?? {});
  };

  it('registers all expected validators', () => {
    VALIDATOR_NAMES.forEach(name => expect(formlyConfig.getValidator(name), name).toBeDefined());
  });

  it('registers the expected validation messages', () => {
    expect(formlyConfig.getValidatorMessage('required')).toBe(REQUIRED_FIELD);
    expect(formlyConfig.getValidatorMessage('minLength')).toBe(MINIMUM_LENGTH_NOT_REACHED);
    expect(formlyConfig.getValidatorMessage('optionMismatch')).toBe('Keine Übereinstimmung gefunden');
    expect(formlyConfig.getValidatorMessage('optionIncomplete')).toBe('Unvollständige Eingabe');
  });

  describe('matchesRegExp / setValidationMessage', () => {
    it('matches a regular expression', () => {
      expect(matchesRegExp(/^\d+$/, '123')).toBe(true);
      expect(matchesRegExp(/^\d+$/, '12a')).toBe(false);
    });

    it('wraps a message into the formly error structure', () => {
      expect(setValidationMessage('boom')).toEqual({ fieldMatch: { message: 'boom' } });
    });
  });

  describe('validateBSNR', () => {
    it.each(['', null, undefined])('accepts empty value %s', value => {
      expect(validateBSNR(value as unknown as string)).toBeNull();
    });

    it('accepts a 9 digit number', () => {
      expect(validateBSNR('123456789')).toBeNull();
    });

    it.each(['12345678', '1234567890', 'abcdefghi'])('rejects %s', value => {
      expect(validateBSNR(value)).toEqual(error(BSNR_ERROR_MSG));
    });
  });

  describe('validateDateInput', () => {
    it('accepts an empty value', () => {
      expect(validateDateInput('')).toBeNull();
    });

    it('accepts a valid past date', () => {
      expect(validateDateInput('05.11.1998')).toBeNull();
    });

    it('rejects a wrongly formatted date', () => {
      expect(validateDateInput('1998-11-05')).toEqual(error(DATE_FORMAT_ERROR_MSG));
    });

    it('rejects a non existing date', () => {
      expect(validateDateInput('31.06.2022')).toEqual(error(DATE_NOT_EXIST));
    });

    it('rejects a date in the future', () => {
      expect(validateDateInput(TOMORROW)).toEqual(error(DATE_IN_FUTURE_ERROR_MSG));
    });
  });

  describe('validatePartialDateInput', () => {
    it('accepts an empty value', () => {
      expect(validatePartialDateInput('')).toBeNull();
    });

    it('delegates full dates to validateDateInput', () => {
      expect(validatePartialDateInput('05.11.1998')).toBeNull();
      expect(validatePartialDateInput(TOMORROW)).toEqual(error(DATE_IN_FUTURE_ERROR_MSG));
    });

    it.each(['2022', '08.1978', '5.11.1998'])('accepts partial date %s', value => {
      expect(validatePartialDateInput(value)).toBeNull();
    });

    it('rejects a partial year in the future', () => {
      expect(validatePartialDateInput(`${TODAY.year + 1}`)).toEqual(error(DATE_IN_FUTURE_ERROR_MSG));
    });

    it('rejects a partial month in the future', () => {
      const future = TODAY.plus({ years: 1 });
      expect(validatePartialDateInput(future.toFormat('LL.yyyy'))).toEqual(error(DATE_IN_FUTURE_ERROR_MSG));
    });

    it('rejects an invalid partial format', () => {
      expect(validatePartialDateInput('11/1998')).toEqual(error(PARTIAL_DATE_FORMAT_ERROR_MSG));
    });
  });

  describe('date helpers', () => {
    it('treats a missing date as valid', () => {
      expect(isEmptyOrInFutureDate(undefined as unknown as Date)).toBe(true);
    });

    it('detects future dates', () => {
      expect(isFutureDate(TODAY.plus({ days: 1 }).toJSDate())).toBe(true);
      expect(isFutureDate(TODAY.toJSDate())).toBe(false);
      expect(isFutureDate(TODAY.minus({ days: 1 }).toJSDate())).toBe(false);
    });

    it('compares start and end date', () => {
      expect(isEndDateLaterThanStartDate(TWO_DAYS_AGO, YESTERDAY)).toBe(true);
      expect(isEndDateLaterThanStartDate(YESTERDAY, YESTERDAY)).toBe(true);
      expect(isEndDateLaterThanStartDate(YESTERDAY, TWO_DAYS_AGO)).toBe(false);
    });
  });

  describe('startDateValidator', () => {
    it('returns the start date error when the start date itself is invalid', () => {
      expect(startDateValidator('31.06.2022', YESTERDAY)).toEqual(error(DATE_NOT_EXIST));
    });

    it('accepts a missing end date', () => {
      expect(startDateValidator(YESTERDAY, '')).toBeNull();
    });

    it('ignores an invalid end date', () => {
      expect(startDateValidator(YESTERDAY, '31.06.2022')).toBeNull();
    });

    it('accepts a start date before the end date', () => {
      expect(startDateValidator(TWO_DAYS_AGO, YESTERDAY)).toBeNull();
    });

    it('rejects a start date after the end date', () => {
      expect(startDateValidator(YESTERDAY, TWO_DAYS_AGO)).toEqual(error(END_DATE_LATER_THAN_START_DATE_ERROR_MSG));
    });

    it('uses a custom error message', () => {
      expect(startDateValidator(YESTERDAY, TWO_DAYS_AGO, 'custom')).toEqual(error('custom'));
    });
  });

  describe('endDateValidator', () => {
    it('returns the end date error when the end date itself is invalid', () => {
      expect(endDateValidator(YESTERDAY, '31.06.2022')).toEqual(error(DATE_NOT_EXIST));
    });

    it('accepts a missing start date', () => {
      expect(endDateValidator('', YESTERDAY)).toBeNull();
    });

    it('ignores an invalid start date', () => {
      expect(endDateValidator('31.06.2022', YESTERDAY)).toBeNull();
    });

    it('accepts an end date after the start date', () => {
      expect(endDateValidator(TWO_DAYS_AGO, YESTERDAY)).toBeNull();
    });

    it('rejects an end date before the start date', () => {
      expect(endDateValidator(YESTERDAY, TWO_DAYS_AGO)).toEqual(error(END_DATE_LATER_THAN_START_DATE_ERROR_MSG));
    });

    it('uses a custom error message', () => {
      expect(endDateValidator(YESTERDAY, TWO_DAYS_AGO, 'custom')).toEqual(error('custom'));
    });
  });

  describe('zip validation', () => {
    it('accepts an empty german zip', () => {
      expect(validateGermanZip('')).toBeNull();
    });

    it('accepts a german zip with 5 digits', () => {
      expect(validateGermanZip('10117')).toBeNull();
    });

    it.each(['1011', '101171', 'abcde'])('rejects the german zip %s', value => {
      expect(validateGermanZip(value)).toEqual(error(ZIP_GERMANY_ERROR_MSG));
    });

    it('accepts an empty international zip', () => {
      expect(validateInternationalZip('')).toBeNull();
    });

    it('accepts an international zip with at least 3 chars and a digit', () => {
      expect(validateInternationalZip('AB1')).toBeNull();
    });

    it.each(['AB', 'ABC', 'AB#1'])('rejects the international zip %s', value => {
      expect(validateInternationalZip(value)).toEqual(error(ZIP_INTERNATIONAL_ERROR_MSG));
    });
  });

  describe('text validation', () => {
    it('accepts an empty term', () => {
      expect(termValidation('')).toBeNull();
    });

    it('accepts a harmless term', () => {
      expect(termValidation('Krankenhaus 1')).toBeNull();
    });

    it.each(['foo@bar', 'foo<bar', "foo'bar"])('rejects the term %s', value => {
      expect(termValidation(value)).toEqual(error(TEXT_ERROR_MSG));
    });

    it('accepts an empty street', () => {
      expect(validateStreet('')).toBeNull();
    });

    it('accepts a street containing an apostrophe', () => {
      expect(validateStreet("O'Brien-Straße")).toBeNull();
    });

    it('rejects a street with dangerous characters', () => {
      expect(validateStreet('Straße<script>')).toEqual(error(TEXT_ERROR_MSG));
    });

    it('accepts an empty additional info', () => {
      expect(checkAdditionalInfoText('')).toBeNull();
    });

    it('accepts additional info with allowed characters', () => {
      expect(checkAdditionalInfoText('Bemerkung @ 5* (wichtig)')).toBeNull();
    });

    it('rejects additional info with dangerous characters', () => {
      expect(checkAdditionalInfoText('Bemerkung <b>')).toEqual(error(TEXT_ERROR_MSG));
    });
  });

  describe('validateName', () => {
    it('accepts an empty name', () => {
      expect(validateName('')).toBeNull();
    });

    it('accepts a plain name', () => {
      expect(validateName('Müller-Lüdenscheidt')).toBeNull();
    });

    it('rejects a blank name', () => {
      expect(validateName('   ')).toEqual(error(BLANK_ERROR_MSG));
    });

    it.each(['Max1', 'Max@Mustermann'])('rejects the name %s', value => {
      expect(validateName(value)).toEqual(error(TEXT_ERROR_MSG));
    });
  });

  describe('validateNotBlank', () => {
    it('accepts an empty value', () => {
      expect(validateNotBlank('')).toBeNull();
    });

    it('accepts a value with content', () => {
      expect(validateNotBlank(' a ')).toBeNull();
    });

    it('rejects a whitespace only value', () => {
      expect(validateNotBlank('    ')).toEqual(error(BLANK_ERROR_MSG));
    });
  });

  describe('validateHouseNumber', () => {
    it('accepts an empty house number', () => {
      expect(validateHouseNumber('')).toBeNull();
    });

    it.each(['1', '12a', '3-5'])('accepts the house number %s', value => {
      expect(validateHouseNumber(value)).toBeNull();
    });

    it.each(['a1', '#1'])('rejects the house number %s', value => {
      expect(validateHouseNumber(value)).toEqual(error(HOUSE_NBR_ERROR_MSG));
    });
  });

  describe('validatePhoneNo', () => {
    it('accepts a valid phone number', () => {
      expect(validatePhoneNo('0301234567')).toBeNull();
    });

    it('accepts a phone number array as delivered by repeatable fields', () => {
      expect(validatePhoneNo([{ phoneNo: '+49301234567' }] as unknown as string)).toBeNull();
    });

    it('rejects an invalid phone number', () => {
      expect(validatePhoneNo('123')).toEqual(error(PHONE_ERROR_MSG));
    });

    it('rejects a missing phone number when required', () => {
      expect(validatePhoneNo('')).toEqual(error(PHONE_ERROR_MSG));
    });

    it('accepts a missing phone number when not required', () => {
      expect(validatePhoneNo('', false)).toBeNull();
    });

    it('still validates a given phone number when not required', () => {
      expect(validatePhoneNo('123', false)).toEqual(error(PHONE_ERROR_MSG));
    });
  });

  describe('validateEmail', () => {
    it('accepts a valid email', () => {
      expect(validateEmail('meine.Email@email.de')).toBeNull();
    });

    it('accepts an email array as delivered by repeatable fields', () => {
      expect(validateEmail([{ email: 'meine.Email@email.de' }] as unknown as string)).toBeNull();
    });

    it('rejects an invalid email', () => {
      expect(validateEmail('no-at-sign')).toEqual(error(EMAIL_ERROR_MSG));
    });

    it('rejects a missing email when required', () => {
      expect(validateEmail('')).toEqual(error(EMAIL_ERROR_MSG));
    });

    it('accepts a missing email when not required', () => {
      expect(validateEmail('', false)).toBeNull();
    });

    it('still validates a given email when not required', () => {
      expect(validateEmail('no-at-sign', false)).toEqual(error(EMAIL_ERROR_MSG));
    });
  });

  describe('checkNumberOfBeds', () => {
    it('accepts an empty value', () => {
      expect(checkNumberOfBeds('')).toBeNull();
    });

    it('accepts up to 6 digits', () => {
      expect(checkNumberOfBeds('999999')).toBeNull();
    });

    it.each(['1000000', '-1', 'abc'])('rejects %s', value => {
      expect(checkNumberOfBeds(value)).toEqual(error(NUMBER_OF_BEDS_ERROR_MSG));
    });
  });

  describe('registered formly validators', () => {
    it('validates the bsnr only when existsBsnr is set', () => {
      expect(run('bsNrValidator', '12345', { existsBsnr: false })).toBeNull();
      expect(run('bsNrValidator', '12345')).toBeNull();
      expect(run('bsNrValidator', '12345', { existsBsnr: true })).toEqual(error(BSNR_ERROR_MSG));
      expect(run('bsNrValidator', '123456789', { existsBsnr: true })).toBeNull();
    });

    it('validates a date input', () => {
      expect(run('dateInputValidator', '05.11.1998')).toBeNull();
      expect(run('dateInputValidator', '05.13.1998')).toEqual(error(DATE_FORMAT_ERROR_MSG));
    });

    it('validates a partial date input', () => {
      expect(run('partialDateInputValidation', '1998')).toBeNull();
      expect(run('partialDateInputValidation', '11/1998')).toEqual(error(PARTIAL_DATE_FORMAT_ERROR_MSG));
    });

    it('validates a german zip', () => {
      expect(run('germanZipValidator', '10117')).toBeNull();
      expect(run('germanZipValidator', '101')).toEqual(error(ZIP_GERMANY_ERROR_MSG));
    });

    it('validates an international zip', () => {
      expect(run('internationalZipValidator', 'AB1')).toBeNull();
      expect(run('internationalZipValidator', 'AB')).toEqual(error(ZIP_INTERNATIONAL_ERROR_MSG));
    });

    it('validates a text', () => {
      expect(run('textValidator', 'Text')).toBeNull();
      expect(run('textValidator', 'Text@')).toEqual(error(TEXT_ERROR_MSG));
    });

    it('validates a street', () => {
      expect(run('streetValidator', 'Hauptstraße')).toBeNull();
      expect(run('streetValidator', 'Hauptstraße<')).toEqual(error(TEXT_ERROR_MSG));
    });

    it('validates a name', () => {
      expect(run('nameValidator', 'Mustermann')).toBeNull();
      expect(run('nameValidator', 'Mustermann1')).toEqual(error(TEXT_ERROR_MSG));
    });

    it('validates a house number', () => {
      expect(run('houseNumberValidator', '12a')).toBeNull();
      expect(run('houseNumberValidator', 'a')).toEqual(error(HOUSE_NBR_ERROR_MSG));
    });

    it('validates a phone number with the configured required option', () => {
      expect(run('phoneValidator', '0301234567')).toBeNull();
      expect(run('phoneValidator', '')).toEqual(error(PHONE_ERROR_MSG));
    });

    it('validates an email with the configured required option', () => {
      expect(run('emailValidator', 'meine.Email@email.de')).toBeNull();
      expect(run('emailValidator', '')).toEqual(error(EMAIL_ERROR_MSG));
    });

    it('validates the additional info text', () => {
      expect(run('additionalInfoTextValidator', 'Info')).toBeNull();
      expect(run('additionalInfoTextValidator', 'Info<')).toEqual(error(TEXT_ERROR_MSG));
    });

    it('validates the number of beds', () => {
      expect(run('numberOfBedsValidator', '10')).toBeNull();
      expect(run('numberOfBedsValidator', '1000000')).toEqual(error(NUMBER_OF_BEDS_ERROR_MSG));
    });

    it('validates a non blank value', () => {
      expect(run('nonBlankValidator', 'a')).toBeNull();
      expect(run('nonBlankValidator', '   ')).toEqual(error(BLANK_ERROR_MSG));
    });
  });

  describe('optionMatchesValidation', () => {
    const fieldWith = (options: unknown[]) =>
      ({
        props: { filter: () => of(options) },
      }) as unknown as FieldType<FieldTypeConfig>;

    it('accepts an empty value', async () => {
      await expect(optionMatchesValidation(asControl(''), fieldWith([]))).resolves.toBeNull();
    });

    it('reports a mismatch when no option is found', async () => {
      await expect(optionMatchesValidation(asControl('xyz'), fieldWith([]))).resolves.toEqual({ optionMismatch: true });
    });

    it('accepts an exactly matching option', async () => {
      await expect(optionMatchesValidation(asControl('Berlin'), fieldWith(['Berlin', 'Berlin-Mitte']))).resolves.toBeNull();
    });

    it('reports an incomplete input when only partial matches exist', async () => {
      await expect(optionMatchesValidation(asControl('Berl'), fieldWith(['Berlin']))).resolves.toEqual({ optionIncomplete: true });
    });
  });
});
