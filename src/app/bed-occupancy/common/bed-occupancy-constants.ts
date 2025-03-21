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



export enum BedOccupancyConstants {
  DEMIS_FORM_WRAPPER_TEMPLATE_KEYWORD = 'demis-formly-tab-navigation',
  FORM_TITLE = 'Tägliche Meldung der belegten und betreibbaren Betten',
  MELDENDE_EINRICHTUNG = 'Meldende Einrichtung',
  BETTENBELEGUNG = 'Bettenbelegung',

  // =================== Routes ===================

  OCCUPIED_BEDS = 'occupiedBeds',
  OPERABLE_BEDS = 'operableBeds',

  // =================== IDs ===================
  // IDs are html IDs that are mostly used in test to target each field uniquely.
  NO_OF_BEDS_CHILDREN_ID = 'children-number-of-beds',
  NO_OF_BEDS_ADULTS_ID = 'adults-number-of-beds',

  // =================== Keys =================
  IK_NUMBER_KEY = 'ikNumber',
  INSTITUTION_NAME_KEY = 'institutionName',
  LOCATION_ID_KEY = 'locationID',
  NO_OF_BEDS_CHILDREN = 'childrenNumberOfBeds',
  NO_OF_BEDS_ADULTS = 'adultsNumberOfBeds',

  // =================== Labels =================
  INSTITUTION_NAME_LABEL = 'Name der Einrichtung',
  INSTITUTION_IDENTIFIER_LABEL = 'Institutionskennzeichen',
  LOCATION_ID_LABEL = 'Standort-ID',
  QUESTIONS_CHILDREN_LABEL = 'Kinder',
  QUESTIONS_ADULTS_LABEL = 'Erwachsene',

  // =================== Messages =================
  ERROR_NO_LOCATIONS_DIALOG = 'Standortliste konnte nicht abgerufen werden',
}
