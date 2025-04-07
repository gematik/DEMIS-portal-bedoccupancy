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

import { PractitionerInfo } from 'src/api/notification';
import { FormlyConstants } from '../formly-constants';
import { formlyInputField, formlyRow } from './commons';

export const practitionerInfoFormConfigFields = formlyRow(
  [
    {
      id: 'salutation',
      type: 'select',
      key: 'salutation',
      className: FormlyConstants.COLMD5,
      props: {
        label: 'Anrede',
        options: [
          { value: PractitionerInfo.SalutationEnum.Mrs, label: 'Frau' },
          { value: PractitionerInfo.SalutationEnum.Mr, label: 'Herr' },
        ],
      },
    },
    formlyInputField({
      key: 'prefix',
      className: FormlyConstants.COLMD5,
      props: {
        label: 'Titel',
      },
    }),
    formlyInputField({
      key: 'firstname',
      className: FormlyConstants.COLMD5,
      props: {
        label: 'Vorname',
        required: true,
      },
      validators: ['nonBlankValidator', 'textValidator'],
    }),
    formlyInputField({
      key: 'lastname',
      className: FormlyConstants.COLMD5,
      props: {
        label: 'Nachname',
        required: true,
      },
      validators: ['nonBlankValidator', 'textValidator'],
    }),
  ],
  'contact'
);
