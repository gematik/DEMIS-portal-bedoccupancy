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



import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { format } from 'date-fns';
import { DateTime } from 'luxon';
import { v4 as uuid_v4 } from 'uuid';

import { CodeDisplay } from 'src/api/notification';
import { HospitalizationConstants } from './hospitalization-constants';
import { TemplateOptions } from './models/template-options.int';
import { SortService } from './services/sort.service';

// CONST:..................................

/*** id: de-DE ***/
export const LOCALE_ID_DE: string = 'de-DE';
registerLocaleData(localeDe, LOCALE_ID_DE, localeDeExtra);

/*** format: yyyy-MM-dd ***/
export const DATE_FORMAT: string = 'yyyy-MM-dd';
/*** format: yyyy-MM-dd ***/
export const DATE_FORMAT_LUXON: string = 'yyyy-LL-dd';
/*** format: dd.MM.yyyy ***/
export const UI_DATE_FORMAT: string = 'dd.MM.yyyy';
/*** format: dd.LL.yyyy ***/
export const UI_LUXON_DATE_FORMAT: string = 'dd.LL.yyyy';
/*** format: dd.LL.yyyy HH:mm:ss ***/
export const UI_LUXON_DATE_TIME_FORMAT: string = `${UI_DATE_FORMAT} HH:mm:ss`;
/*** yyyy, mm.yyyy, dd.MM.yyyy ***/
export const UI_DATE_PLACE_HOLDER: string = `${UI_DATE_FORMAT.toLowerCase()}`;
export const PARTIAL_DATE_FORMAT: string = 'yyyy | mm.yyyy | dd.mm.yyyy ';
/*** code: DE ***/
export const GERMANY_COUNTRY_CODE: string = 'DE';
/*** code: 21481 ***/
export const ZIP_CODE_DEFAULT: string = '21481';

export const ZIP_GERMANY_MIN_LENGTH: number = 4;
export const ZIP_GERMANY_MAX_LENGTH: number = 5;
export const ZIP_INTERNATIONAL_MIN_LENGTH: number = 3;
export const ZIP_INTERNATIONAL_MAX_LENGTH: number = 50;
export const TEXT_MAX_LENGTH: number = 100;
export const MORE_INFO_MAX_LENGTH: number = 5000;
export const HOUSE_NBR_MAX_LENGTH: number = 51;
export const PHONE_MIN_LENGTH: number = 7; // 0 oder +, gefolgt von mindestens 6 Ziffern
export const PHONE_MAX_LENGTH: number = 50;
export const EMAIL_MAX_LENGTH: number = 5000;

// VALIDATIONS: More about this Reg-exp rules: https://wiki.gematik.de/pages/viewpage.action?pageId=459871766 ..........

export const BSNR_REG_EXP: RegExp = /^\d{9}$/; // 9-stellige Nummer
export const DATE_FORMAT_PARTIAL_EXP: RegExp = /^(((0?[1-9]|[1-2][0-9]|3[0-1])\.)?(0?[1-9]|1[0-2])\.)?([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)$/; //yyyy, mm.yyyy, dd.mm.yyyy, m.yyyy, d.m.yyyy
export const DATE_FORMAT_REG_EXP: RegExp = /^(((0[1-9]|[1-2][0-9]|3[0-1])\.)?(0[1-9]|1[0-2])\.)?([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)$/; // for the format: yyyy, mm.yyyy, dd.mm.yyyy
export const DATE_FORMAT_DD_MM_YYYY_REG_EXP: RegExp = /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.]([1-9])\d{3}$/; // for the format: dd.mm.yyyy
export const EMAIL_REG_EXP: RegExp = /^[A-Z0-9+_.-]+@[A-Z0-9.-]{5,320}$/i;
export const HOUSE_NBR_REG_EXP: RegExp = /^[0-9][\/ \-+0-9a-zA-Z]{0,50}$/; // No special characters allowed
export const PHONE_REG_EXP: RegExp = /^[0+][0-9 \-()]{6,50}$/; // Starts with 0 or +, followed by 7-15 digits
export const TEXT_REG_EXP: RegExp = /^[^@\\*?$|=´'"\[\]{}<>]{0,100}$/; // No dangerous signs allowed
export const STREET_REG_EXP: RegExp = /^[^@\\*?$|=´"\[\]{}<>]{0,100}$/;
export const ADDITIONAL_INFO_REG_EXP: RegExp = /^[^\\=´'<>]{0,5000}$/; // No dangerous signs allowed
export const ZIP_GERMANY_REG_EXP: RegExp = /^\d{5}$/; // 5 Ziffern allowed
export const ZIP_INTERNATIONAL_REG_EXP: RegExp = /(?=^[\w\- ]{3,50}$)(?=.*\d)/;
export const NAME_REG_EXP: RegExp = /^[^@\\*?$|=´'"\[\]{}<>0-9]{0,100}$/; // from https://wiki.gematik.de/x/JRlpGw
export const NUMBER_OF_BEDS: RegExp = /^\d{0,6}$/;

export const REQUIRED_FIELD: string = 'Pflichtfeld';
export const MINIMUM_LENGTH_NOT_REACHED = 'Minimallänge nicht erreicht';
export const BSNR_ERROR_MSG: string = 'Bitte geben Sie Ihre 9-stellige Betriebsstättennummer (BSNR) ein';
export const CHECK_INPUT_ERROR_MSG: string = 'Eingabe bitte überprüfen';
export const DATE_FORMAT_ERROR_MSG: string = 'Kein gültiges Datum (Beispiele: 05.11.1998)';
export const DATE_NOT_EXIST: string = 'Das Datum existiert nicht!';
export const PARTIAL_DATE_FORMAT_ERROR_MSG: string = 'Kein gültiges Datum (Beispiele: 2022, 08.1978, 05.11.1998)';
export const DATE_IN_FUTURE_ERROR_MSG: string = 'Das Datum darf nicht in der Zukunft liegen';
export const EMAIL_ERROR_MSG: string = 'Keine gültige E-Mail (Beispiel: meine.Email@email.de)';
export const BLANK_ERROR_MSG: string = 'Es muss mindestens ein Zeichen eingegeben werden';
export const HOUSE_NBR_ERROR_MSG: string = 'Keine gültige Hausnummer';
export const END_DATE_LATER_THAN_START_DATE_ERROR_MSG: string = 'Das Startdatum darf nicht nach dem Enddatum liegen';
export const NO_SPECIAL_CHARACTERS_ALLOWED_ERROR_MSG: string = 'Es sind keine Sonderzeichen erlaubt';
export const PHONE_ERROR_MSG: string = 'Die Telefonnummer muss mit 0 oder + beginnen, gefolgt von mindestens 6 Ziffern.';
export const TEXT_ERROR_MSG: string = 'Ihre Eingabe enthält unzulässige Sonderzeichen';
export const ZIP_GERMANY_ERROR_MSG: string = 'Die Postleitzahl muss aus 5 Ziffern bestehen';
export const ZIP_INTERNATIONAL_ERROR_MSG: string = 'Die Postleitzahl muss aus mindestens 3 Zeichen und einer Ziffer bestehen';
export const INIT_INFO_VALIDATOR_ERROR_MSG: string = 'Informationen zur Person nicht vollständig!';
export const ADDITIONAL_INFO_ERROR_MSG: string = 'Ihre Eingabe enthält unzulässige Sonderzeichen.';
export const NUMBER_OF_BEDS_ERROR_MSG: string = 'Bitte geben Sie eine positive Zahl kleiner 1000000 ein.';
export const EMPTY_DROPDOWN_MENU_MSG: string = 'Es konnten keine Standorte zu Ihrem Institutionskennzeichen gefunden werden!';

export const GERMAN_LANGUAGE_SELECTORS = ['de', 'de-de', 'de-at', 'de-ch'];

export const MY_DATE_FORMATS = {
  parse: { dateInput: UI_LUXON_DATE_FORMAT },
  display: {
    dateInput: UI_LUXON_DATE_FORMAT,
    monthYearLabel: 'yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'yyyy',
  },
};

// FUNCTIONS:...............................

/***
 * for automatic generation of a UUID *
 */
export function createUUID(): string {
  return uuid_v4();
}

/***
 * to get the current date with local timestamp and not the UTC time
 */
export function getTimestamp(): string {
  return getTimestampFromDate(new Date());
}

/***
 * special for getting the local timestamp and not the UTC time
 *
 * @param datetime
 */
export function getTimestampFromDate(datetime: Date): string {
  /**
   * special for getting the local timestamp and not the UTC time.
   */
  return new Date(datetime.toString().split('GMT')[0] + ' UTC').toISOString();
}

/***
 *
 * @param profile
 * @param id
 */
export function createReferenceUrl(profile: string, id: string): string {
  return profile.concat('/', id);
}

/***
 * returns current date as Date
 *
 * @param stringFormat
 */
export function newDate(stringFormat?: string): string {
  return format(new Date(), stringFormat ? stringFormat : DATE_FORMAT);
}

/***
 *
 * @param enumList
 */
export function getTemplateOptionsList(enumList: any): Array<TemplateOptions> {
  const optionsList: Array<TemplateOptions> = [];
  //@ts-ignore
  Object.values(enumList).forEach((value: string) => {
    //@ts-ignore
    const label: string = HospitalizationConstants[`${value}_LABEL`];
    if (!!label) {
      optionsList.push({ value: value, label: label });
    }
  });

  return optionsList;
}

/***
 *
 * @param date
 */
export function setDateTimeStringFormat(date: Date): string {
  const now: Date = new Date();
  date.setHours(now.getHours());
  date.setMinutes(now.getMinutes());
  date.setSeconds(now.getSeconds());
  return date.toISOString();
}

/***
 * to reformat date string from DD.MM.YYYY to MM.DD.YYYY
 *
 * @param date
 */
export function convertDeToUsStringDateFormat(date: string): string {
  const splitDate = date.split('.');
  return `${splitDate[1]}.${splitDate[0]}.${splitDate[2]}`;
}

/***
 * to convert string to date
 *
 * @param date
 */
export function stringToDate(date: string): Date {
  return Date.parse(date) ? new Date(date) : new Date(date);
}

/***
 * to convert string to Luxon date
 *
 * @param date
 * @param format
 */
export function stringToDateFromLuxon(date: string, format?: string): Date {
  format = format ?? UI_LUXON_DATE_FORMAT;
  //@ts-ignore
  return !!date && DateTime.fromFormat(date, format).isValid ? DateTime.fromFormat(date, format).toJSDate() : null;
}

/***
 * to build date from partial (yyyy, mm.yyyy) date
 *  - PS: can be use to check if the partial date is in the future
 *
 * @param partialDate
 */
export function buildDateFromPartialDate(partialDate: string): Date | null {
  if (partialDate) {
    const splitDate: Array<string> = partialDate.split('.');
    switch (splitDate.length) {
      case 1:
        return new Date(`01.01.${splitDate[0]}`); // length = 1 when date = yyyy
      case 2:
        return new Date(`${splitDate[0]}.01.${splitDate[1]}`); // length = 2 when date = mm.yyyy
      case 3:
        return DateTime.fromFormat(partialDate, UI_LUXON_DATE_FORMAT).toJSDate();
      default:
        return null;
    }
  } else {
    return null;
  }
}

/***
 * to reformat date:
 *  - from: UI String "yyyy, mm.yyyy. dd.mm.yyyy"
 *  - to: FHIR specified string "yyyy, yyyy-mm, yyyy-mm-dd"
 *
 * @param partialDate
 */
export function reformatUiDateString(partialDate: string): string | null {
  if (partialDate) {
    const splitDate: Array<string> = partialDate.split('.');
    switch (splitDate.length) {
      case 1:
        return partialDate;
      case 2:
        return `${splitDate[1]}-${convertPartialDate(splitDate[0])}`;
      case 3:
        return `${splitDate[2]}-${convertPartialDate(splitDate[1])}-${convertPartialDate(splitDate[0])}`;
      default:
        return null;
    }
  } else {
    return null;
  }
}

/**
 * used on partial dates
 * i.e. Feb: 2 -> 02
 */
function convertPartialDate(no: string): string {
  return no.length > 1 ? no : `0${no}`;
}

/***
 * to reformat the date before sending it to "notification-gateway" so that it looks
 * like the fhir Date format
 *
 *  - from: UI String "dd.mm.yyyy"
 *  - to: FHIR specified string "yyyy-MM-dd"
 *
 * @param date
 */
export function toFhirDateFormat(date: string): string {
  if (!!date) {
    return DateTime.fromFormat(date, UI_LUXON_DATE_FORMAT).toFormat(DATE_FORMAT_LUXON);
  } else {
    return '';
  }
}

/***
 * to reformat the date before sending it to "notification-gateway" so that it looks
 * like the fhir Date-Time format
 *
 *  - from: UI String "dd.mm.yyyy"
 *  - to: FHIR specified date-time string (ISO) "yyyy-MM-dd'T'HH:mm:ss.SSSXXX" *
 *
 * @param date
 */
//@ts-ignore
export function toFhirDateTimeFormat(date: string): string {
  if (!!date) {
    return DateTime.fromFormat(toFhirDateFormat(date), DATE_FORMAT_LUXON).toString();
  }
}

/***
 * to asc. sort the enum list by label name
 *
 * @param enumList
 * @param sortService
 */
export function getSortedEnumList(enumList: any, sortService: SortService): Array<TemplateOptions> {
  return sortService.sortObjects(getTemplateOptionsList(enumList), true, 'label');
}

/***
 *
 * @param enumList
 */
export function setCss2ColumnLength(enumList: any): void {
  const length: number = Math.round(Object.values(enumList).length / 2);
  document.documentElement.style.setProperty('--two-column-length', length.toString());
}

export function getDisplayValue(codeDisplay?: CodeDisplay): string | undefined {
  //@ts-ignore
  const germanDisplayValue: Array<Designation> = //@ts-ignore
    codeDisplay.designations?.filter(d =>
      //@ts-ignore
      GERMAN_LANGUAGE_SELECTORS.includes(d.language?.toLowerCase())
    );
  return germanDisplayValue?.length > 0 ? germanDisplayValue[0].value : codeDisplay?.display;
}

export function formatCodeDisplay(cd: CodeDisplay): string {
  return getDisplayValue(cd) + ' | ' + cd.code;
}
