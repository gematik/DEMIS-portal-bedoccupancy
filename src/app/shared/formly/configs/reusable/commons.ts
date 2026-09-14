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

import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FormlyConstants } from '../formly-constants';

export const formlyInputField = (config: {
  key: string;
  className: string;
  props: FormlyFieldProps;
  validators?: string[];
  id?: string;
}): FormlyFieldConfig => {
  return {
    id: config.id ? config.id : config.key,
    key: config.key,
    className: config.className,
    type: 'input',
    props: config.props,
    validators: {
      validation: config.validators ? config.validators : config.props.required ? ['textValidator', 'nonBlankValidator'] : ['textValidator'],
    },
  };
};

export const formlyRow = (fieldConfig: FormlyFieldConfig[], key?: string, className: string = FormlyConstants.ROW) => {
  return {
    key: key ? key : undefined,
    fieldGroupClassName: className,
    fieldGroup: fieldConfig,
  } as FormlyFieldConfig;
};

const REQUIRED_FIELDS_HINT_TEXT = 'Felder mit * sind Pflichtangaben';
const REQUIRED_FIELDS_HINT_ARIA_LABEL = 'Hinweis: Felder mit Stern sind Pflichtangaben';

export const requiredFieldsHintTemplate = `<p class="demis-form-required-fields-hint" role="note" aria-label="${REQUIRED_FIELDS_HINT_ARIA_LABEL}">${REQUIRED_FIELDS_HINT_TEXT}</p>`;

export const formlyRequiredFieldsHint = (): FormlyFieldConfig => ({
  className: FormlyConstants.LAYOUT_FULL_LINE,
  template: `<div class="demis-form-required-fields-hint-row">${requiredFieldsHintTemplate}</div>`,
});

export const formlyIntro = (introHtml: string, includeRequiredFieldsHint: boolean): FormlyFieldConfig =>
  formlyRow([
    {
      className: FormlyConstants.LAYOUT_FULL_LINE,
      template: `<div class="demis-form-intro">${introHtml}${includeRequiredFieldsHint ? requiredFieldsHintTemplate : ''}</div>`,
    },
  ]);
