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

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { FieldType } from '@ngx-formly/material';
import { isArray } from 'lodash-es';
import { DateTime } from 'luxon';
import { map } from 'rxjs/operators';
import {
  ADDITIONAL_INFO_REG_EXP,
  BLANK_ERROR_MSG,
  BSNR_ERROR_MSG,
  BSNR_REG_EXP,
  DATE_FORMAT_DD_MM_YYYY_REG_EXP,
  DATE_FORMAT_ERROR_MSG,
  DATE_FORMAT_PARTIAL_EXP,
  DATE_IN_FUTURE_ERROR_MSG,
  DATE_NOT_EXIST,
  EMAIL_ERROR_MSG,
  EMAIL_REG_EXP,
  END_DATE_LATER_THAN_START_DATE_ERROR_MSG,
  HOUSE_NBR_ERROR_MSG,
  HOUSE_NBR_REG_EXP,
  MINIMUM_LENGTH_NOT_REACHED,
  NAME_REG_EXP,
  NUMBER_OF_BEDS,
  NUMBER_OF_BEDS_ERROR_MSG,
  PARTIAL_DATE_FORMAT_ERROR_MSG,
  PHONE_ERROR_MSG,
  PHONE_REG_EXP,
  REQUIRED_FIELD,
  STREET_REG_EXP,
  stringToDateFromLuxon,
  TEXT_ERROR_MSG,
  TEXT_REG_EXP,
  UI_LUXON_DATE_FORMAT,
  ZIP_GERMANY_ERROR_MSG,
  ZIP_GERMANY_REG_EXP,
  ZIP_INTERNATIONAL_ERROR_MSG,
  ZIP_INTERNATIONAL_REG_EXP,
} from './common-utils';

/**
 * Result of a synchronous field validation: either `null` when the value is
 * valid, or the Formly error object produced by {@link setValidationMessage}.
 */
export type ValidationResult = { fieldMatch: { message: string } } | null;

export const NotificationFormValidationModule = FormlyModule.forRoot({
  validators: [
    { name: 'bsNrValidator', validation: bsNrValidation },
    { name: 'dateInputValidator', validation: dateInputValidation },
    {
      name: 'partialDateInputValidation',
      validation: partialDateInputValidation,
    },
    { name: 'germanZipValidator', validation: germanZipValidation },
    { name: 'houseNumberValidator', validation: houseNumberValidation },
    {
      name: 'internationalZipValidator',
      validation: internationalZipValidation,
    },
    { name: 'textValidator', validation: textValidation },
    { name: 'streetValidator', validation: streetValidation },
    {
      name: 'phoneValidator',
      validation: phoneValidation,
      options: { required: true },
    },
    {
      name: 'emailValidator',
      validation: emailValidation,
      options: { required: true },
    },

    { name: 'nameValidator', validation: nameValidation },
    {
      name: 'additionalInfoTextValidator',
      validation: additionalInfoTextValidation,
    },
    { name: 'numberOfBedsValidator', validation: numberOfBedsValidation },
    { name: 'nonBlankValidator', validation: nonBlankValidator },
    { name: 'optionMatches', validation: optionMatchesValidation },
  ],
  validationMessages: [
    { name: 'minLength', message: MINIMUM_LENGTH_NOT_REACHED },
    { name: 'required', message: REQUIRED_FIELD },
    { name: 'optionMismatch', message: 'Keine Übereinstimmung gefunden' },
    { name: 'optionIncomplete', message: 'Unvollständige Eingabe' },
  ],
});

//********** FUNKTIONEN **************

// Exportable:...

export function validateBSNR(bsNummer: string): ValidationResult {
  if (!bsNummer) return null;
  return matchesRegExp(BSNR_REG_EXP, bsNummer) ? null : setValidationMessage(BSNR_ERROR_MSG);
}

function dateExist(date: string): boolean {
  return !!DateTime.fromFormat(date, UI_LUXON_DATE_FORMAT).toISODate();
}

export function validateDateInput(date: string): ValidationResult {
  if (!date) return null;
  // check for the format: dd.mm.yyyy
  if (!matchesRegExp(DATE_FORMAT_DD_MM_YYYY_REG_EXP, date)) return setValidationMessage(DATE_FORMAT_ERROR_MSG);
  // check for not-existing dates like: '31.06.2022'
  if (!dateExist(date)) return setValidationMessage(DATE_NOT_EXIST);
  const parsedDate: Date = DateTime.fromFormat(date, UI_LUXON_DATE_FORMAT).toJSDate();
  return isEmptyOrInFutureDate(parsedDate) ? setValidationMessage(DATE_IN_FUTURE_ERROR_MSG) : null;
}

export function validatePartialDateInput(date: string): ValidationResult {
  // check for the format: dd.mm.yyyy
  if (matchesRegExp(DATE_FORMAT_DD_MM_YYYY_REG_EXP, date)) return validateDateInput(date);
  if (!date) return null;
  // check for the format: yyyy, mm.yyyy, dd.mm.yyyy, m.yyyy, d.m.yyyy
  if (!matchesRegExp(DATE_FORMAT_PARTIAL_EXP, date)) return setValidationMessage(PARTIAL_DATE_FORMAT_ERROR_MSG);
  return partialDateNotInFuture(date) ? null : setValidationMessage(DATE_IN_FUTURE_ERROR_MSG);
}

export function isEmptyOrInFutureDate(date: Date): boolean {
  // !date means that it is not a required field therefore it is also valid if it is not given.
  // but if given, then it should be valid
  return !date || isFutureDate(date);
}

export function isFutureDate(date: Date): boolean {
  const today = DateTime.local();
  const givenDate = DateTime.fromJSDate(date);
  return givenDate.startOf('day') > today.startOf('day');
}

export function startDateValidator(startDate: string, endDate: string, errorMsg?: string): ValidationResult {
  const startDateNotValid: ValidationResult = validateDateInput(startDate);
  if (startDateNotValid) return startDateNotValid;
  if (!endDate || validateDateInput(endDate)) return null;
  return isEndDateLaterThanStartDate(startDate, endDate) ? null : setValidationMessage(errorMsg ?? END_DATE_LATER_THAN_START_DATE_ERROR_MSG);
}

export function endDateValidator(startDate: string, endDate: string, errorMsg?: string): ValidationResult {
  const endDateNotValid: ValidationResult = validateDateInput(endDate);
  if (endDateNotValid) return endDateNotValid;
  if (!startDate || validateDateInput(startDate)) return null;
  return isEndDateLaterThanStartDate(startDate, endDate) ? null : setValidationMessage(errorMsg ?? END_DATE_LATER_THAN_START_DATE_ERROR_MSG);
}

export function isEndDateLaterThanStartDate(startDate: string, endDate: string): boolean {
  return stringToDateFromLuxon(startDate) <= stringToDateFromLuxon(endDate);
}

export function validateGermanZip(zip: string): ValidationResult {
  if (!zip) return null;
  return matchesRegExp(ZIP_GERMANY_REG_EXP, zip) ? null : setValidationMessage(ZIP_GERMANY_ERROR_MSG);
}

export function termValidation(term: string): ValidationResult {
  // following signs not accepted: @ \ * ? $ | = ´ ' " [ ] { } < >
  if (!term) return null;
  return matchesRegExp(TEXT_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG);
}

export function validateStreet(term: string): ValidationResult {
  // following signs not accepted: @ \ * ? $ | = " [ ] { } < >
  if (!term) return null;
  return matchesRegExp(STREET_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG);
}

export function validateName(term: string): ValidationResult {
  // following signs not accepted: @ \ * ? $ | = ´ ' " [ ] { } < > 0-9
  if (!term) return null;
  return validateNotBlank(term) || (matchesRegExp(NAME_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG));
}

export function checkAdditionalInfoText(term: string): ValidationResult {
  // following signs not accepted: \ = ´ ' < >
  if (!term) return null;
  return matchesRegExp(ADDITIONAL_INFO_REG_EXP, term) ? null : setValidationMessage(TEXT_ERROR_MSG);
}

export function validateHouseNumber(hausNumber: string): ValidationResult {
  if (!hausNumber) return null;
  return matchesRegExp(HOUSE_NBR_REG_EXP, hausNumber) ? null : setValidationMessage(HOUSE_NBR_ERROR_MSG);
}

export function validateInternationalZip(zip: string): ValidationResult {
  if (!zip) return null;
  return matchesRegExp(ZIP_INTERNATIONAL_REG_EXP, zip) ? null : setValidationMessage(ZIP_INTERNATIONAL_ERROR_MSG);
}

export function validatePhoneNo(phoneNumber: string, required = true): ValidationResult {
  if (required || phoneNumber) {
    return validatePhoneNoRegex(phoneNumber);
  } else {
    return null;
  }
}

function validatePhoneNoRegex(phoneNumber: string): ValidationResult {
  return matchesRegExp(PHONE_REG_EXP, isArray(phoneNumber) ? (phoneNumber[0].phoneNo as string) : phoneNumber) ? null : setValidationMessage(PHONE_ERROR_MSG);
}

export function validateNotBlank(s: string): ValidationResult {
  if (!s) return null;
  return matchesRegExp(/.*\S.*/, s) ? null : setValidationMessage(BLANK_ERROR_MSG);
}

export function validateEmail(email: string, required = true): ValidationResult {
  if (required || email) {
    return validateEmailRegex(email);
  } else {
    return null;
  }
}

function validateEmailRegex(email: string): ValidationResult {
  return matchesRegExp(EMAIL_REG_EXP, isArray(email) ? email[0].email : email) ? null : setValidationMessage(EMAIL_ERROR_MSG);
}

export function checkNumberOfBeds(noOfBeds: string): ValidationResult {
  if (!noOfBeds) return null;
  return matchesRegExp(NUMBER_OF_BEDS, noOfBeds) ? null : setValidationMessage(NUMBER_OF_BEDS_ERROR_MSG);
}

export function matchesRegExp(regExp: RegExp, value: string): boolean {
  return regExp.test(value);
}

export function setValidationMessage(valMessage: string): ValidationResult {
  return { fieldMatch: { message: valMessage } };
}

// Private:...

function bsNrValidation(control: AbstractControl): ValidationResult {
  return control?.parent?.value?.existsBsnr ? validateBSNR(control.value) : null;
}

function partialDateNotInFuture(date: string): boolean {
  const splitDate: string[] = date.split('.');
  const now: Date = new Date();

  switch (splitDate.length) {
    case 1:
      return +splitDate[0] <= now.getFullYear(); // length = 1 when date = yyyy
    case 2:
      return new Date(+splitDate[1], +splitDate[0] - 1) <= now; // -1 as month is monthIndex
    case 3:
      return new Date(+splitDate[2], +splitDate[1] - 1, +splitDate[0]) <= now;
    default:
      return false;
  }
}

/***
 * For the validation of dates of type: Input (String)
 *
 * @param control
 */
function dateInputValidation(control: AbstractControl): ValidationResult {
  return validateDateInput(control.value);
}

function partialDateInputValidation(control: AbstractControl): ValidationResult {
  return validatePartialDateInput(control.value);
}

function germanZipValidation(control: AbstractControl): ValidationResult {
  return validateGermanZip(control.value);
}

function textValidation(control: AbstractControl): ValidationResult {
  return termValidation(control.value);
}

function streetValidation(control: AbstractControl): ValidationResult {
  return validateStreet(control.value);
}

function nameValidation(control: AbstractControl): ValidationResult {
  return validateName(control.value);
}

function houseNumberValidation(control: AbstractControl): ValidationResult {
  return validateHouseNumber(control.value);
}

function internationalZipValidation(control: AbstractControl): ValidationResult {
  return validateInternationalZip(control.value);
}

function phoneValidation(control: AbstractControl, field: FormlyFieldConfig, options): ValidationResult {
  return validatePhoneNo(control.value, options.required);
}

function emailValidation(control: AbstractControl, field: FormlyFieldConfig, options): ValidationResult {
  return validateEmail(control.value, options.required);
}

function additionalInfoTextValidation(control: AbstractControl): ValidationResult {
  return checkAdditionalInfoText(control.value);
}

function numberOfBedsValidation(control: AbstractControl): ValidationResult {
  return checkNumberOfBeds(control.value);
}

function nonBlankValidator(control: AbstractControl): ValidationResult {
  return validateNotBlank(control.value);
}

export async function optionMatchesValidation(control: AbstractControl, field: FieldType<FieldTypeConfig>): Promise<ValidationErrors> {
  return field.props
    .filter(control.value)
    .pipe(
      map((options: unknown[]) => {
        if (!control.value) {
          return null;
        }
        if (options.length === 0) {
          return { optionMismatch: true };
        }
        if (options.includes(control.value)) {
          return null;
        }
        return { optionIncomplete: true };
      })
    )
    .toPromise();
}
