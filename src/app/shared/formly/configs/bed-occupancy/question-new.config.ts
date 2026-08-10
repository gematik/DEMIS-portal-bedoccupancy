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

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { NUMBER_OF_BEDS_ERROR_MSG } from '../../../common-utils';
import { FormlyConstants } from '../formly-constants';

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

const createBedNumberField = (prefix: string, child: boolean, required: boolean): FormlyFieldConfig => ({
  id: `${prefix}-${child ? BedOccupancyConstants.NO_OF_BEDS_CHILDREN_ID : BedOccupancyConstants.NO_OF_BEDS_ADULTS_ID}`,
  key: child ? BedOccupancyConstants.NO_OF_BEDS_CHILDREN : BedOccupancyConstants.NO_OF_BEDS_ADULTS,
  className: FormlyConstants.LAYOUT_FULL_LINE,
  props: {
    label: child ? BedOccupancyConstants.QUESTIONS_CHILDREN_LABEL : BedOccupancyConstants.QUESTIONS_ADULTS_LABEL,
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
  fieldGroup: [createBedNumberField(prefix, false, required), createBedNumberField(prefix, true, required)],
});

// rename with removal of FEATURE_FLAG_PORTAL_BED_OCCUPANCY_SIDENAV
export const questionBedOccupancyHtmlConfigFieldsNew: FormlyFieldConfig[] = [
  createHeader('Belegte Betten auf den Normalstationen des meldenden Standortes'),
  createBedSection(BedOccupancyConstants.OCCUPIED_BEDS, 'occupied-beds', true),
  createHeader('Wenn Information vorhanden: <br> Betreibbare Betten auf den Normalstationen des meldenden Standortes'),
  createBedSection(BedOccupancyConstants.OPERABLE_BEDS, 'operable-beds', false),
];
