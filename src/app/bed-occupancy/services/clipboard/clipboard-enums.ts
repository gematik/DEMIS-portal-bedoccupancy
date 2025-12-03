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

//current docs under:  https://wiki.gematik.de/pages/viewpage.action?pageId=474108853

// Bettenbelegung
export enum BedOccupancyQuestionClipboard {
  ADULTS_OCCUPIED = 'B.adultsOccupied',
  CHILDREN_OCCUPIED = 'B.childrenOccupied',
  ADULTS_OPERABLE = 'B.adultsOperable',
  CHILDREN_OPERABLE = 'B.childrenOperable',
}

// Datenübernahme Error Dialog Texte
export enum ClipboardErrorTexts {
  CLIPBOARD_ERROR = 'error reading clipboard: ',
  CLIPBOARD_ERROR_DIALOG_TITLE = 'Fehler beim Einlesen der Daten aus der Zwischenablage',
  CLIPBOARD_ERROR_DIALOG_MESSAGE = 'Bei der Datenübernahme ist ein Fehler aufgetreten.',
  CLIPBOARD_ERROR_DIALOG_MESSAGE_DETAILS = 'Diese Daten werden aus der Zwischenablage importiert. Bitte wenden Sie sich an Ihre IT zur Konfiguration des Datenimports. Weitere Informationen finden Sie in der DEMIS Wissensdatenbank unter "<a href="https://wiki.gematik.de/x/fGFCH" target="_blank">Übergabe von Daten aus dem Primärsystem</a>".',
  CLIPBOARD_PHONE_SELECTOR = 'phone',
}

// Meldende Einrichtung
export enum NotifierFacilityClipboard {
  FACILITY_NAME = 'F.name',
  FACILITY_BSNR = 'F.bsnr',
  FACILITY_ZIP = 'F.zip',
  FACILITY_STREET = 'F.street',
  FACILITY_CITY = 'F.city',
  FACILITY_COUNTRY = 'F.country',
  FACILITY_HOUSENUMBER = 'F.houseNumber',
  NOTIFIER_SALUTATION = 'N.salutation',
  NOTIFIER_PREFIX = 'N.prefix',
  NOTIFIER_GIVEN = 'N.given',
  NOTIFIER_FAMILY = 'N.family',
  NOTIFIER_PHONE = 'N.phone',
  NOTIFIER_PHONE2 = 'N.phone2',
  NOTIFIER_EMAIL = 'N.email',
  NOTIFIER_EMAIL2 = 'N.email2',
}
