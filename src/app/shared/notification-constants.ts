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



export enum NotificationConstants {
  // =================== PATHS ===================
  WELCOME_PATH = 'welcome',
  ABOUT_PATH = 'about',
  IMPRESSUM_PATH = 'impressum',
  TEST_RESULT_PATH = 'melden_testergebnis',
  QUICK_TEST_PATH = 'quick-test-notification',
  HOSPITALIZATION_PATH = 'melden_erkrankung',
  DISEASE_NOTIFICATION_PATH = 'disease-notification',
  BED_OCCUPANCY_PATH = 'bed_occupancy',
  SEQUENCE_NOTIFICATION_PATH = 'sequence_notification',

  BED_OCCUPANCY_NOTIFICATION_PATH = 'bed-occupancy',
  BED_OCCUPANCY_NOTIFIER_FACILITY = 'meldende-einrichtung-form',
  BED_OCCUPANCY_OCCUPIED_BEDS = 'occupied-beds-form',
  SEQUENCE_UPLOAD_NOTIFICATION_PATH = 'sequence-notification',
  PATHOGEN_PATH = 'melden_erreger',
  PATHOGEN_NOTIFICATION_PATH = 'pathogen-notification',
  AUTHENTICATION_PATH = 'authentication',
  SELECTION_PATH = 'selection',
  NOT_FOUND_PATH = 'not-found',

  // =================== TABS ===================
  HOME_TAB = WELCOME_PATH,
  ABOUT_TAB = ABOUT_PATH,
  IMPRESSUM_TAB = IMPRESSUM_PATH,
  TEST_RESULT_TAB = TEST_RESULT_PATH,
  HOSPITALIZATION_TAB = HOSPITALIZATION_PATH,
  BED_OCCUPANCY_TAB = BED_OCCUPANCY_PATH,
  SEQUENCE_NOTIFICATION_TAB = SEQUENCE_NOTIFICATION_PATH,
  PATHOGEN_TEST_RESULTS_TAB = PATHOGEN_PATH,

  // =================== LINKS ===================
  DATA_ANALYSIS_LINK = 'http://go.gematik.de/demisanalyse',
  DEMIS_WDB_LINK = 'https://wiki.gematik.de/display/DSKB',
  SUPPORT_CAPITA_LINK = 'https://gematik.capita-europe.com/DEMIS',
  SUPPORT_CONTACT_LINK = 'https://go.gematik.de/demis-support',

  // =================== LABELS ===================
  DEMIS_MORE_INFO_LABEL = 'Klicken Sie, um mehr über das DEMIS-System zu erfahren',
  REPORT_INFO_LABEL = 'Klicken Sie, um einen neuen Fall zu melden',
  UPLOAD_INFO_LABEL = 'Klicken Sie, um einen neuen Fall hoch zu laden',
  DATA_ANALYSIS_INFO_LABEL = 'Klicken Sie, um Daten zu melde­pflichtigen Infektions­krankheiten abzufragen',
  START_PAGE_LINK_LABEL = 'Startseite',
  POSITIVE_TEST_RESULT_LINK_LABEL = 'Positives SARS-CoV-2-Testergebnis melden',
  SUBMIT_DISEASE_LINK_LABEL = 'Krankheit melden',
  SUBMIT_BED_OCCUPANCY_LINK_LABEL = 'Bettenbelegung melden',
  SUBMIT_SEQUENCE_NOTIFICATION_LINK_LABEL = 'Sequenzdaten übermitteln',
  ABOUT_DEMIS_LINK_LABEL = 'Über DEMIS',
  DATA_ANALYSIS_LINK_LABEL = 'Datenanalyse',
  HELP_LINK_LABEL = 'Hilfe',
  IMPRINT_LINK_LABEL = 'Impressum',
  DEMIS_KNOWLEDGE_DATABASE_LINK_LABEL = 'DEMIS Wissensdatenbank',
  SUPPORT_QUESTIONS_LINK_LABEL = 'Supportanfragen',

  // =================== TEXTS ===================
  AUTHENTICATION_ERROR_TEXT = 'Sie haben nicht die nötigen Rechte um die Seite aufzurufen!',
  DEMIS_MORE_INFO_TEXT = 'Das Deutsche Elektronische Melde- und Informationssystem für den Infektionsschutz (DEMIS) ermöglicht die elektronische Meldung von melde­pflichtigen Infektions-Krankheiten an das zuständige Gesundheitsamt.',
  REPORT_TEST_RESULT_TEXT = 'Hier finden Sie die Formulare, mit denen Sie eine Meldung eines positiven SARS-CoV-2-Testergebnis gemäß Infektionsschutzgesetz (IfSG) absetzen können.',
  PATHOGEN_RESULT_TEXT = 'Hier finden Sie die Formulare, mit denen Sie der gesetzlichen Pflicht gemäß IfSG (§7 Absatz 1 IfSG) zur Meldung zur Ermittlung von Krankheitserregern nachkommen können.',
  REPORT_HOSPITALIZATION_TEXT = 'Hier finden Sie die Formulare, mit denen Sie gemäß Infektionsschutzgesetz (IfSG) den Verdacht, die Erkrankung, die Hospitalisierung bzw. den Tod in Bezug auf COVID-19 melden können.',
  BED_OCCUPANCY_TEXT = 'Hier finden Sie die Formulare, mit denen Sie der gesetzlichen Pflicht gemäß IfSG (§ 13 Absatz 7 IfSG) zur Meldung zur Ermittlung der Krankenhausbetten-belegung nachkommen können.',
  SEQUENCE_NOTIFICATION_TEXT = 'Hier finden Sie die Formulare, mit denen Sie Sequenz- und Sequenzmetadaten gemäß §13 Absatz 3 IfSG an das RKI übermitteln können.',
  DATA_ANALYSIS_INFO_TEXT = 'Hier können Daten zu melde­pflichtigen Infektions­krankheiten abgefragt werden. Durch individuell erstellte Abfragen lassen sich Tabellen und Grafiken erzeugen.',
}
