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

import { Component } from '@angular/core';
import { FieldArrayType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  standalone: false,
})
export class RepeatComponent extends FieldArrayType {
  constructor() {
    super();
  }

  setIdName(type: string, formlyField: FormlyFieldConfig, index: number): string {
    let fieldId: string | number | (string | number)[] = '';
    formlyField.fieldGroup!.forEach((field: FormlyFieldConfig) => {
      if (field.type === 'input') {
        return (fieldId =
          field.id && field.id !== '' ? (field.id.includes('_input_') ? field.id.split('_input_')[1] : field.id) : field.key || 'MISSING_FORMLY_KEY');
      } else {
        return type + '-' + fieldId + '_' + (index + 1);
      }
    });
    return type + '-' + fieldId + '_' + (index + 1);
  }

  setAddButtonIdName(buttonName: string): string {
    return 'btn-' + buttonName.toLocaleLowerCase().split(' ').join('-');
  }

  isLonely(formlyField: FormlyFieldConfig, isContact?: boolean) {
    if (isContact && this.areContactsLonely()) {
      return true;
    } else if (!isContact) {
      return formlyField.parent?.model?.length == 1;
    } else {
      return formlyField.parent?.model?.length == 0;
    }
  }

  private areContactsLonely() {
    return (
      (this.form.value.emailAddresses?.length == 0 && this.form.value.phoneNumbers?.length == 1) ||
      (this.form.value.emailAddresses?.length == 1 && this.form.value.phoneNumbers?.length == 0)
    );
  }
}
