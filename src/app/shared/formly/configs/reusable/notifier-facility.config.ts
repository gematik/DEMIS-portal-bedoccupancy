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
import { FormlyConstants } from '../formly-constants';
import { addressFormConfigFields } from './address.config';
import { bsnrFormlyFieldConfig, existsBsnrFormlyFieldConfig } from './bsnr.config';
import { formlyInputField } from './commons';
import { oneTimeCodeConfigField } from './oneTimeCode.config';
import { practitionerInfoFormConfigFields } from './practitioner-info.config';

export const notifierFacilityFormConfigFields: FormlyFieldConfig[] = [
  {
    className: '',
    template: '<h2>Einrichtung</h2>',
  },
  {
    fieldGroupClassName: FormlyConstants.ROW,
    key: 'facilityInfo',
    fieldGroup: [
      formlyInputField({
        key: 'institutionName',
        className: FormlyConstants.LAYOUT_FULL_LINE,
        props: {
          label: 'Name der Einrichtung',
          required: true,
        },
        validators: ['nonBlankValidator', 'textValidator'],
      }),
      existsBsnrFormlyFieldConfig,
      bsnrFormlyFieldConfig,
    ],
  },
  {
    className: '',
    template: '<h2>Adresse</h2>',
  },
  {
    key: 'address',
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: addressFormConfigFields(true),
  },
  {
    template: '<h2>Ansprechperson (Melder)</h2>',
  },
  practitionerInfoFormConfigFields,
  oneTimeCodeConfigField,
  { template: '<h2>Kontaktmöglichkeiten</h2>' },
];
