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



export enum HospitalizationConstants {
  // =================== ID ===================
  // IDs are html IDs that are mostly used in test to target each field uniquely.
  INSTITUTION_NAME_ID = 'institutionName',
  NOTIFIER_LAST_NAME_ID = 'lastName',
  NOTIFIER_FIRST_NAME_ID = 'firstName',
  NOTIFIED_PERSON_PHONE_ID = 'notifiedPersonPhone',
  NOTIFIED_PERSON_EMAIL_ID = 'notifiedPersonEmail',
  REGION_LABEL = 'Geografische Region',
  HOSPITALIZED_ID = 'hospitalized',
  HOSPITALIZED_ENCOUNTER_INFO = 'hospitalizedEncounterInfo',
  HOSPITALIZATION_START_DATE_ID = 'hospitalizationStartDate',
  HOSPITALIZATION_END_DATE_ID = 'hospitalizationEndDate',
  INTENSIVE_CARE_ID = 'intensiveCare',
  INTENSIVE_CARE_START_DATE_ID = 'intensiveCareStartDate',
  HOSPITALIZATION_ADDITIONAL_INFO_ID = 'intensiveCareAdditionalInfo',
  DEAD_ID = 'dead',
  DEATH_DATE_ID = 'deathDate',
  MILITARY_RELATION_ID = 'military',
  LAB_ASSIGNED_ID = 'labAssigned',
  NAME_ID = 'name',
  LAB_INFO_ID = 'labInfo',
  INFECTION_PROTECTION_FACILITY_EXISTING_ID = 'infectionProtectionFacilityExisting',
  INFECTION_PROTECTION_FACILITY_RELATION_ID = 'infectionProtectionFacilityRole',
  INFECTION_PROTECTION_FACILITY_NAME_ID = 'infectionProtectionFacilityName',
  INFECTION_PROTECTION_FACILITY_STREET_ID = 'infectionProtectionFacilityStreet',
  INFECTION_PROTECTION_FACILITY_HOUSE_NUMBER_ID = 'infectionProtectionFacilityHouseNumber',
  INFECTION_PROTECTION_FACILITY_ZIP_CODE_ID = 'infectionProtectionFacilityZip',
  INFECTION_PROTECTION_FACILITY_CITY_ID = 'infectionProtectionFacilityCity',
  INFECTION_PROTECTION_FACILITY_COUNTRY_ID = 'infectionProtectionFacilityCountry',
  INFECTION_PROTECTION_FACILITY_CONTACTS_INFO_ID = 'infectionProtectionFacilityContactsInfo',
  INFECTION_PROTECTION_FACILITY_PHONE_ID = 'infectionProtectionFacilityPhone',
  INFECTION_PROTECTION_FACILITY_EMAIL_ID = 'infectionProtectionFacilityEmail',
  INFECTION_PROTECTION_FACILITY_START_DATE_ID = 'infectionProtectionFacilityStartDate',
  INFECTION_PROTECTION_FACILITY_END_DATE_ID = 'infectionProtectionFacilityEndDate',
  EXPOSURE_PLACE_KNOWN_ID = 'exposurePlaceKnown',
  REGION_ID = 'region',
  EXPOSURE_PLACE_START_DATE_ID = 'exposureStartDate',
  EXPOSURE_PLACE_END_DATE_ID = 'exposureEndDate',
  EXPOSURE_PLACE_HINT_ID = 'placeExposureHint',
  ORGAN_DONOR_ID = 'organDonor',
  ADDITIONAL_INFO_ID = 'additionalInfo',
  DISEASE_START_ID = 'diseaseStart',
  DIAGNOSIS_DATE_ID = 'diagnosisDate',
  CONDITION_INFO_NOTE_ID = 'conditionInfoNote',
  SYMPTOM_STATUS_ID = 'symptomStatus',
  SYMPTOMS_ID = 'symptoms',
  ADDRESS_ID = 'address',
  CONTACT_TO_INFECTED_ID = 'contactToInfected',
  VALUE_ID = 'value',

  // covid19-indications-form
  IMMUNIZATION_STATUS_ID = 'immunizationStatus',
  INFECTION_ENVIRONMENT_EXISTING_ID = 'infectionEnvironmentExisting',
  INFECTION_ENVIRONMENT_KIND_ID = 'infectionEnvironmentKind',
  INFECTION_ENVIRONMENT_START_DATE_ID = 'infectionEnvironmentStartDate',
  INFECTION_ENVIRONMENT_END_DATE_ID = 'infectionEnvironmentEndDate',
  VACCINATIONS_ID = 'vaccinations',
  VACCINATION_DATE_ID = 'vaccinationDate',
  VACCINATION_ADDITIONAL_INFO_ID = 'additionalInfo',
  VACCINE_ID = 'vaccine',
  VALUE_KEY = 'value',
  CONTACT_TYPE_KEY = 'contactType',

  // =================== Keys =================
  ADDITIONAL_INFO_KEY = 'additionalInfo',
  INFECTION_PROTECTION_FACILITY_INFO_KEY = 'infectionProtectionFacilityInfo',
  INFECTION_PROTECTION_FACILITY_EXISTING_KEY = 'infectionProtectionFacilityExisting',
  ROLE_KEY = 'role',
  FACILITY_NAME_KEY = 'facilityName',
  STREET_KEY = 'street',
  HOUSE_NUMBER_KEY = 'houseNumber',
  ZIP_CODE_KEY = 'zip',
  CITY_KEY = 'city',
  COUNTRY_KEY = 'country',
  CONTACTS_INFO_KEY = 'contactsInfo',
  PHONE_KEY = 'phone',
  EMAIL_KEY = 'email',
  START_DATE_KEY = 'startDate',
  END_DATE_KEY = 'endDate',
  // ExposurePlaceQuestion
  EXPOSURE_PLACE_INFO_KEY = 'exposurePlaceInfo',
  PLACE_EXPOSURE_KNOWN_KEY = 'exposurePlaceKnown',
  HINT_KEY = 'hint',
  REGION_KEY = 'region',
  // InfectionEnvironmentQuestion
  INFECTION_ENVIRONMENT_INFO_KEY = 'infectionEnvironmentInfo',
  SYMPTOM_STATUS_KEY = 'symptomStatus',
  SYMPTOMS_KEY = 'symptoms',
  CONDITION_INFO_NOTE_KEY = 'note',

  // =================== Questions ===================
  IS_HOSPITALIZED = '1. Ist bzw. wurde die Person ins Krankenhaus aufgenommen?',
  IS_DEAD = 'Ist die Person verstorben?',
  IS_DEAD_ADVANCED = '2. Ist die Person verstorben?',
  RELATED_TO_MILITARY_QUESTION = '3. Besteht eine Zugehörigkeit zur Bundeswehr?',
  IS_LAB_ASSIGNED_QUESTION = '4. Wurde ein Labor mit der Durchführung einer Erregerdiagnostik beauftragt?',
  RELATED_TO_INFECTION_PROTECTION_FACILITY_QUESTION = '5. Ist die betroffene Person in einer für den Infektionsschutz relevanten Einrichtung tätig, betreut oder untergebracht?\n' +
    '(Die für den Infektionsschutz relevanten Einrichtungen sind im Infektionsschutzgesetz definiert. Dazu zählen u.a. Einrichtungen gemäß § 23 IfSG (z.B. Krankenhäuser, ärztliche ' +
    'Praxen, Dialyseeinrichtungen und Rettungsdienste), gemäß §33 IfSG (z.B. Kitas, Kinderhorte, Schulen, Heime und Ferienlager)  und gemäß § 36 IfSG (Pflegeeinrichtungen, Obdachlosenunterkünfte, ' +
    'Einrichtungen zur gemeinschaftlichen Unterbringung von Asylsuchenden, sonstige Massenunterkünfte, Justizvollzugsanstalten)',
  RELATION_TO_INFECTION_PROTECTION_FACILITY_QUESTION = 'In welcher Beziehung steht die Person zur Einrichtung? *',
  PLACE_EXPOSURE_KNOWN_QUESTION = '6. Ist der wahrscheinliche Expositionsort bekannt?',
  ORGAN_DONOR_QUESTION = '7. Wurde die Person in den letzten 6 Monaten als Spender für Blut, Organe, Gewebe oder Zellen registriert?',

  // condition info
  HAS_SYMPTOM = 'Hat die betroffene Person COVID-19-Symptome?',

  // covid19-indications-form

  CONTACT_TO_INFECTED_QUESTION = '1. Ist ein Kontakt mit einem bestätigten COVID-19-Fall in den 14 Tagen vor Erkrankungsbeginn bekannt?',
  INFECTION_ENVIRONMENT_EXISTING_QUESTION = '2. Liegen Informationen zum vermuteten Infektionsumfeld vor, in dem eine Infektion am wahrscheinlichsten stattgefunden hat?',
  IMMUNIZATION_STATUS_QUESTION = 'Wurde die betroffene Person jemals in Bezug auf die Krankheit geimpft?',
  IMMUNIZATION_STATUS_QUESTION_ADVANCED = '3. Wurde die betroffene Person jemals in Bezug auf die Krankheit geimpft?',

  // =================== Labels ===================
  HOSPITALIZATION_START_DATE_LABEL = 'Aufnahmedatum',
  HOSPITALIZATION_END_DATE_LABEL = 'Entlassdatum',
  INTENSIVE_CARE_QUESTION_LABEL = 'Person auf Intensivstation aufgenommen',
  INTENSIVE_CARE_START_DATE_LABEL = 'Datum der Aufnahme auf Intensivstation',
  ADDITIONAL_INFO_LABEL = 'Zusatzinformationen',
  YES_LABEL = 'ja',
  No_LABEL = 'nein',
  INDETERMINATE_LABEL = 'nicht ermittelbar',
  UNKNOWN_LABEL = 'nicht erhoben',
  DEATH_DATE_LABEL = 'Datum des Todes',
  MILITARY_SOLDIER_LABEL = 'Soldat/BW-Angehöriger',
  CIVILIAN_IN_MILITARY_FACILITY_LABEL = 'Zivilperson tätig/untergebracht in Einrichtung der BW',
  UNRELATED_TO_MILITARY_LABEL = 'Kein Bezug zur BW',
  LAB_NAME_LABEL = 'Name des Labors',
  EMPLOYMENT_LABEL = 'Tätigkeit',
  CARE_LABEL = 'Betreuung',
  ACCOMMODATION_LABEL = 'Unterbringung',
  FACILITY_NAME_LABEL = 'Name der Einrichtung',
  STREET_LABEL = 'Straße',
  HOUSE_NUMBER_LABEL = 'Hausnummer',
  ZIP_CODE_LABEL = 'Postleitzahl',
  CITY_LABEL = 'Stadt',
  COUNTRY_LABEL = 'Land',
  PHONE_LABEL = 'Telefonnummer',
  EMAIL_LABEL = 'Email-Adresse',
  IMPORTANT_ADDITIONAL_INFO_LABEL = 'Wichtige Zusatzinformationen',

  DISEASE_START_LABEL = 'Erkrankungsbeginn',
  DIAGNOSIS_DATE_LABEL = 'Datum der Diagnosestellung',

  // Symptoms
  ACUTE_RESPIRATORY_DISTRESS_SYNDROME_LABEL = 'akutes schweres Atemnotsyndrom (ARDS)',
  SORE_THROAT_SYMPTOM_LABEL = 'Halsschmerzen/-entzündung',
  GENERALLY_UNWELL_LABEL = 'allgemeine Krankheitszeichen',
  COUGH_LABEL = 'Husten',
  PATIENT_VENTILATED_LABEL = 'beatmungspflichtige Atemwegserkrankung',
  HEADACHE_LABEL = 'Kopfschmerzen',
  DIARRHEA_LABEL = 'Durchfall, nicht näher bezeichnet',
  PNEUMONIA_LABEL = 'Lungenentzündung',
  DYSPNEA_LABEL = 'Dyspnoe (Atemstörung)',
  MUSCLE_PAIN_LABEL = 'Muskel-, Glieder- oder Rückenschmerzen',
  FEVER_LABEL = 'Fieber',
  SNIFFLES_LABEL = 'Schnupfen',
  CHILL_LABEL = 'Frösteln',
  TACHYCARDIA_LABEL = 'Tachykardie',
  LOSS_OF_SENSE_OF_SMELL_LABEL = 'Geruchsverlust',
  TACHYPNEA_LABEL = 'Tachypnoe (beschleunigte Atmung)',
  LOSS_OF_TASTE_LABEL = 'Geschmacksverlust',
  OTHER_COVID_19_SYMPTOMS_LABEL = 'andere COVID-19-Symptome',
  SYMPTOME_UND_MANIFESTATIONEN_LABEL = 'Symptome und Manifestationen',
  NO_SYMPTOM_SELECTED_LABEL = 'Bitte wählen Sie mindestens ein Symptom aus.',
  DIAGNOSTIC_NOTE_LABEL = 'Diagnosehinweise',

  // 'Klinische Angaben'
  START_LABEL = 'Beginn',
  END_LABEL = 'Ende',
  EXPOSURE_HINT_LABEL = 'Anmerkungen zum Expositionsort',

  // covid19-indications-form
  INFECTION_ENVIRONMENT_KIND_LABEL = 'Wahrscheinliches Infektionsumfeld',
  INFECTION_ENVIRONMENT_START_DATE_LABEL = 'Beginn Infektionsumfeld',
  INFECTION_ENVIRONMENT_END_DATE_LABEL = 'Ende Infektionsumfeld',
  // Impfstoffe
  MODERNA_LABEL = 'COVID-19 Vaccine Moderna',
  JANSSEN_LABEL = 'COVID-19 Vaccine Janssen',
  COMIRNATY_LABEL = 'Comirnaty (Biontech)',
  VAXZEVRIA_LABEL = 'Vaxzevria (AstraZeneca)',
  VALNEVA_LABEL = 'Valneva',
  NUVAXOVID_LABEL = 'Nuvaxovid',
  OTHER_LABEL = 'Anderer Impfstoff',

  VACCINATION_DATE_LABEL = 'Impfdatum',
  ADD_MORE_VACCINE_LABEL = 'Weitere Impfung hinzufügen',
  VACCINATION_DEFAULT_DATE = '01.01.2000',

  // Clipboard
  CLIPBOARD_ERROR = 'error reading clipboard: ',
  ERROR_DIALOG_WIDTH = '50vw',
  ERROR_DIALOG_HEIGTH = '40vh',
  ERROR_DIALOG_PANEL = 'app-submit-notification-dialog-panel',
  CLIPBOARD_ERROR_DIALOG_TITLE = 'Fehler beim Einlesen der Daten aus der Zwischenablage',
  CLIPBOARD_ERROR_DIALOG_MESSAGE = 'Bei der Datenübernahme ist ein Fehler aufgetreten.',
  CLIPBOARD_ERROR_DIALOG_MESSAGE_DETAILS = 'Diese Daten werden aus der Zwischenablage importiert. Bitte wenden Sie sich an Ihre IT zur Konfiguration des Datenimports. Weitere Informationen finden Sie in der DEMIS Wissensdatenbank unter "<a href="https://wiki.gematik.de/x/fGFCH" target="_blank">Übergabe von Daten aus dem Primärsystem</a>".',
  CLIPBOARD_ERROR_DIALOG_BUTTON = 'Schließen',
  CLIPBOARD_ERROR_DIALOG_VALUE = 'close',
  CLIPBOARD_PHONE_SELECTOR = 'phone',

  HOSPITALIZATION_ADVANCED_FORM_ENABLED = 'HOSPITALIZATION_ADVANCED_FORM_ENABLED',
}
