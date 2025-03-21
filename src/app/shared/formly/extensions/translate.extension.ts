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



import { TranslateService } from '@ngx-translate/core';
import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import * as _ from 'lodash-es';

export class TranslateExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig) {
    const to = field.props || {};
    if (!to.translations || to._translated) {
      return;
    }
    to._translated = true;
    field.expressions = {
      ...(field.expressions || {}),
      ..._.mapValues(to.translations, value => () => this.translate.instant(value)),
    };
  }
}

export function registerTranslateExtension(translate: TranslateService) {
  return {
    extensions: [
      {
        name: 'translate',
        extension: new TranslateExtension(translate),
      },
    ],
  };
}
