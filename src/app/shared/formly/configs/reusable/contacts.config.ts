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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { ContactPointInfo } from 'src/api/notification';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EMAIL_MAX_LENGTH, PHONE_MAX_LENGTH } from '../../../common-utils';
import { FormlyConstants } from '../formly-constants';
import ContactTypeEnum = ContactPointInfo.ContactTypeEnum;
import UsageEnum = ContactPointInfo.UsageEnum;

export const contactsFormConfigFields: (needsContact: boolean, hospitalizationPerson?: boolean) => FormlyFieldConfig[] = (
  needsContact,
  hospitalizationPerson = false
) => [
  {
    className: FormlyConstants.LAYOUT_HEADER,
    template: '<h2>Kontaktmöglichkeiten</h2>',
    expressions: { hide: () => !hospitalizationPerson },
  },
  {
    className: FormlyConstants.LAYOUT_HEADER,
    template: `<p>Bitte geben Sie mindestens eine Kontaktmöglichkeit an.</p>`,
    expressions: { hide: () => !needsContact },
  },
  {
    key: 'contacts',
    fieldGroup: createContactSection(needsContact),
  },
];

function createContactSection(needsContact: boolean): FormlyFieldConfig[] {
  return [
    createRepeatableContactField(
      {
        key: 'phoneNumbers',
        inputFeldLabel: 'Telefonnummer',
        inputMaxLength: PHONE_MAX_LENGTH,
        validatorName: 'phoneValidator',
        idForTest: 'phoneNo',
        requiredExpression: (field: FormlyFieldConfig) => field.form?.get('emailAddresses')?.value.length === 0,
        defaultContactType: ContactTypeEnum.Phone,
      },
      needsContact
    ),

    createRepeatableContactField(
      {
        key: 'emailAddresses',
        inputFeldLabel: 'Email-Adresse',
        inputMaxLength: EMAIL_MAX_LENGTH,
        validatorName: 'emailValidator',
        idForTest: 'email',
        requiredExpression: (field: FormlyFieldConfig) => field.form?.get('phoneNumbers')?.value.length === 0,
        defaultContactType: ContactTypeEnum.Email,
      },
      needsContact
    ),
  ];
}

function createRepeatableContactField(config: ContactFieldConfig, needsContact: boolean): FormlyFieldConfig {
  return {
    key: config.key,
    id: config.key,
    type: 'repeater',
    className: 'bed-occupancy-contact-button',
    wrappers: ['validation'],
    props: { addButtonLabel: config.inputFeldLabel + ' hinzufügen' },
    expressions: { 'props.required': needsContact ? config.requiredExpression : () => false },
    defaultValue: needsContact ? [{}] : undefined,
    fieldArray: {
      className: FormlyConstants.COLMD11,
      fieldGroupClassName: undefined,
      fieldGroup: [
        {
          key: 'contactType',
          defaultValue: config.defaultContactType,
        },
        {
          key: 'usage',
          defaultValue: needsContact ? UsageEnum.Work : undefined,
        },
        {
          className: 'flex-grow-1',
          type: 'input',
          key: 'value',
          defaultValue: '',
          props: {
            label: config.inputFeldLabel,
            required: true,
            maxLength: config.inputMaxLength,
            attributes: { 'data-cy': config.idForTest },
          },
          validators: {
            validation: [config.validatorName],
          },
          validation: {
            show: true,
          },
          expressions: {
            'validation.show': (model: any) => !!model?.value,
          },
        },
      ],
    },
  };
}

interface ContactFieldConfig {
  key: 'phoneNumbers' | 'emailAddresses';
  inputFeldLabel: string;
  inputMaxLength: number;
  validatorName: string;
  idForTest: string;
  requiredExpression?: (field: FormlyFieldConfig) => boolean;
  defaultContactType: ContactTypeEnum;
  requiredSiblingKey?: string;
}
