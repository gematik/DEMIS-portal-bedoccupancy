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



import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { ValueSetService } from '../../../core/services/value-set.service';

/**
 * Befüllt options in Auswahllisten (select, radio, etc.) mit Werten aus ValueSets.
 * Erwartet `valueSetIdentifier` in props einer Field-Definition.
 * Achtung: überschreibt vordefinierte options NICHT!
 */
export class ValueSetExtension implements FormlyExtension {
  constructor(private valueSets: ValueSetService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const isRadioOrSelect: boolean = field.type === 'radio' || field.type === 'select';
    if (!isRadioOrSelect) return;

    const valueSetIdentifier: string = field.props.valueSetIdentifier;
    if (!valueSetIdentifier) return;

    const hasOptions = field.props.options && Array.isArray(field.props.options) && field.props.options.length === 0;
    if (hasOptions) return;

    field.props.options = this.valueSets.get(valueSetIdentifier);
  }
}

export function registerValueSetExtension(valueSets: ValueSetService) {
  return {
    extensions: [
      {
        name: 'valueSets',
        extension: new ValueSetExtension(valueSets),
      },
    ],
  };
}
