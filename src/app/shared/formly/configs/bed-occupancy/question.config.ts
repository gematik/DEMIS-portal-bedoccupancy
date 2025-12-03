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

import { FormlyFieldConfig } from '@ngx-formly/core';

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { FormlyConstants } from '../formly-constants';
import { formlyInputField } from '../reusable/commons';
import { environment } from 'src/environments/environment';

const numberOfBedsFieldGroup = (required: boolean, prefix: string) => [
  numberOfBedsFormConfigFields(false, required, prefix),
  numberOfBedsFormConfigFields(true, required, prefix),
];

const numberOfBedsFormConfigFields = (child: boolean, required: boolean, prefix: string) =>
  formlyInputField({
    key: child ? BedOccupancyConstants.NO_OF_BEDS_CHILDREN : BedOccupancyConstants.NO_OF_BEDS_ADULTS,
    id: child ? `${prefix}${BedOccupancyConstants.NO_OF_BEDS_CHILDREN_ID}` : `${prefix}${BedOccupancyConstants.NO_OF_BEDS_ADULTS_ID}`,
    className: FormlyConstants.LAYOUT_FULL_LINE,
    props: {
      label: child ? BedOccupancyConstants.QUESTIONS_CHILDREN_LABEL : BedOccupancyConstants.QUESTIONS_ADULTS_LABEL,
      required: required,
    },
    validators: ['numberOfBedsValidator'],
  });

/**
 * Used to get the correct template tag depending on the feature flag FEATURE_FLAG_PORTAL_PAGE_STRUCTURE
 * If the flag is active, h2 is used as the template tag, otherwise h1.
 * *BEWARE*: Remove this function when the feature flag is removed.
 *
 * @returns The template tag to be used (h1 or h2)
 */
const getTemplateTag = () => {
  return environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_PAGE_STRUCTURE ? 'h2' : 'h1';
};

export const questionBedOccupancyHtmlConfigFields: FormlyFieldConfig[] = [
  {
    className: FormlyConstants.LAYOUT_HEADER,
    // This trick is used to force the re-evaluation of the feature flag each time the form is rendered.
    // *BEWARE*: Change this to a regular property when the feature flag is removed.
    get template() {
      return `<${getTemplateTag()}>Belegte Betten auf den Normalstationen des meldenden Standortes</${getTemplateTag()}></div>`;
    },
  },
  {
    key: BedOccupancyConstants.OCCUPIED_BEDS,
    id: BedOccupancyConstants.OCCUPIED_BEDS,
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: numberOfBedsFieldGroup(true, 'occupied-beds-'),
  },
  {
    className: FormlyConstants.LAYOUT_HEADER,
    // This trick is used to force the re-evaluation of the feature flag each time the form is rendered.
    // *BEWARE*: Change this to a regular property when the feature flag is removed.
    get template() {
      return `<${getTemplateTag()}>Wenn Information vorhanden: <br> Betreibbare Betten auf den Normalstationen des meldenden Standortes</${getTemplateTag()}></div>`;
    },
  },
  {
    key: BedOccupancyConstants.OPERABLE_BEDS,
    id: BedOccupancyConstants.OPERABLE_BEDS,
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: numberOfBedsFieldGroup(false, 'operable-beds-'),
  },
];
