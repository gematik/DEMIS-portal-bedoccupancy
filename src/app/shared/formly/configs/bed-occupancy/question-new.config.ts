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

import { FormlyFieldConfig } from '@ngx-formly/core';
import { environment } from 'src/environments/environment';

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { NUMBER_OF_BEDS_ERROR_MSG } from '../../../common-utils';
import { FormlyConstants } from '../formly-constants';
import { formlyIntro, formlyRequiredFieldsHint } from '../reusable/commons';

const isPortalBedTextEnabled = (): boolean => environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_BED_TEXT ?? false;
const isA11yRequiredFieldsInfoEnabled = (): boolean => environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_BED_A11Y_INFO_REQUIREDFIELDS ?? false;

const bedNumberValidation = {
  messages: {
    min: () => NUMBER_OF_BEDS_ERROR_MSG,
    max: () => NUMBER_OF_BEDS_ERROR_MSG,
  },
};

const createHeader = (text: string): FormlyFieldConfig => ({
  className: FormlyConstants.LAYOUT_HEADER,
  template: `<h2>${text}</h2></div>`,
});

const getBedLabel = (sectionKey: BedOccupancyConstants.OCCUPIED_BEDS | BedOccupancyConstants.OPERABLE_BEDS, child: boolean): string => {
  if (!isPortalBedTextEnabled()) {
    return child ? 'Kinder' : 'Erwachsene';
  }

  if (sectionKey === BedOccupancyConstants.OCCUPIED_BEDS) {
    return child ? BedOccupancyConstants.OCCUPIED_BEDS_CHILDREN_LABEL : BedOccupancyConstants.OCCUPIED_BEDS_ADULTS_LABEL;
  }

  return child ? BedOccupancyConstants.OPERABLE_BEDS_CHILDREN_LABEL : BedOccupancyConstants.OPERABLE_BEDS_ADULTS_LABEL;
};

const createBedNumberField = (
  prefix: string,
  child: boolean,
  required: boolean,
  sectionKey: BedOccupancyConstants.OCCUPIED_BEDS | BedOccupancyConstants.OPERABLE_BEDS
): FormlyFieldConfig => ({
  id: `${prefix}-${child ? BedOccupancyConstants.NO_OF_BEDS_CHILDREN_ID : BedOccupancyConstants.NO_OF_BEDS_ADULTS_ID}`,
  key: child ? BedOccupancyConstants.NO_OF_BEDS_CHILDREN : BedOccupancyConstants.NO_OF_BEDS_ADULTS,
  className: FormlyConstants.LAYOUT_FULL_LINE,
  props: {
    label: getBedLabel(sectionKey, child),
    max: 999999,
    min: 0,
    ...(required ? { required: true } : {}),
  },
  type: 'number',
  validation: bedNumberValidation,
});

const createBedSection = (
  sectionKey: BedOccupancyConstants.OCCUPIED_BEDS | BedOccupancyConstants.OPERABLE_BEDS,
  prefix: 'occupied-beds' | 'operable-beds',
  required: boolean
): FormlyFieldConfig => ({
  key: sectionKey,
  id: sectionKey,
  fieldGroupClassName: FormlyConstants.ROW,
  fieldGroup: [createBedNumberField(prefix, false, required, sectionKey), createBedNumberField(prefix, true, required, sectionKey)],
});

// rename with removal of FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV
export const questionBedOccupancyHtmlConfigFieldsNew = (): FormlyFieldConfig[] => {
  const questionText = isPortalBedTextEnabled()
    ? `<div role="note">
    <div class="info-notification-text"><span class="material-icons-outlined primary-color-icon" aria-hidden="true">error_outline</span><div class="message"><p>Die Anzahl der belegten Betten auf Normalstationen wird getrennt nach Betten für Kinder und Erwachsene gemeldet. Wird ein Kind auf einer Station für Erwachsene behandelt, zählt dieses Bett als Bett für Erwachsene.</p>
    <p>Ein Bett gilt als betreibbar, wenn entsprechend der Versorgungsstufe jeweils ein vorgesehener Raum, funktionsfähige Geräte und Material pro Bettenplatz, Betten und personelle Besetzung mit pflegerischem und ärztlichem Fachpersonal vorhanden sind und eingesetzt werden können. Aufgrund dieser zahlreichen Betriebsfaktoren kann sich die Anzahl von aktuell betreibbaren Betten in einem Meldebereich kontinuierlich verändern. Diese Zahl kann auch (deutlich) von der Zahl der Planbetten im Krankenhauslandesplan abweichen.</p>
    <p>Für die Meldung ist der Bettenbelegungsstand des Vortages um 12:00 Uhr maßgeblich; die Übermittlung hat täglich bis 11:00 Uhr zu erfolgen.</p></div></div>
    </div>`
    : null;

  return [
    ...(questionText ? [formlyIntro(questionText, isA11yRequiredFieldsInfoEnabled())] : []),
    ...(!questionText && isA11yRequiredFieldsInfoEnabled() ? [formlyRequiredFieldsHint()] : []),
    createHeader('Belegte Betten auf Normalstationen des meldenden Standortes'),
    createBedSection(BedOccupancyConstants.OCCUPIED_BEDS, 'occupied-beds', true),
    createHeader('Betreibbare Betten auf Normalstationen des meldenden Standortes (falls bekannt)'),
    createBedSection(BedOccupancyConstants.OPERABLE_BEDS, 'operable-beds', false),
  ];
};
