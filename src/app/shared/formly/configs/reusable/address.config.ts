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



import { FormlyFieldConfig } from '@ngx-formly/core';

import {
  GERMANY_COUNTRY_CODE,
  ZIP_GERMANY_MAX_LENGTH,
  ZIP_GERMANY_MIN_LENGTH,
  ZIP_INTERNATIONAL_MAX_LENGTH,
  ZIP_INTERNATIONAL_MIN_LENGTH,
} from '../../../common-utils';
import { ValueSets } from 'src/app/shared/models/fhir/value-sets';

import { AddressType } from 'src/api/notification';
import { FormlyConstants } from '../formly-constants';
import { formlyInputField, formlyRow } from './commons';

export const addressFormConfigFields = (required: boolean, idPrefix: string = '', disabled: boolean = false) => [
  formlyInputField({
    id: `${idPrefix}street`,
    key: `street`,
    className: 'col-md-8',
    props: {
      label: 'Straße',
      required: required,
      disabled: disabled,
    },
    validators: required ? ['streetValidator', 'nonBlankValidator'] : ['streetValidator'],
  }),
  formlyInputField({
    id: `${idPrefix}houseNumber`,
    key: 'houseNumber',
    className: FormlyConstants.COLMD3,
    props: {
      maxLength: 10,
      label: 'Hausnummer',
      required: required,
      disabled: disabled,
    },
    validators: ['houseNumberValidator'],
  }),
  formlyInputField({
    id: `${idPrefix}zip`,
    key: 'zip',
    className: FormlyConstants.COLMD3,
    props: {
      maxLength: required ? ZIP_GERMANY_MAX_LENGTH : ZIP_INTERNATIONAL_MAX_LENGTH,
      minLength: required ? ZIP_GERMANY_MIN_LENGTH : ZIP_INTERNATIONAL_MIN_LENGTH,
      label: 'Postleitzahl',
      required: true,
      disabled: disabled,
    },
    validators: [required ? 'germanZipValidator' : 'internationalZipValidator'],
  }),
  formlyInputField({
    id: `${idPrefix}city`,
    key: 'city',
    className: 'col-md-8',
    props: {
      label: 'Stadt',
      required: required,
      disabled: disabled,
    },
  }),
  {
    id: `${idPrefix}country`,
    key: 'country',
    className: 'col-11',
    type: 'select',
    defaultValue: GERMANY_COUNTRY_CODE,
    props: {
      label: 'Land',
      required: required,
      options: [{ value: 'DE', label: 'Deutschland' }],
      disabled: required,
    },
  },
];
