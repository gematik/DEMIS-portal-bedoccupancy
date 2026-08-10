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

import { FormlyExtension } from '@ngx-formly/core';
import { environment } from '../../environments/environment';
import { VALUE_DEFAULT_PLACEHOLDER, VALUE_DEFUALT_SELECT_PLACEHOLDER } from './common-utils';

export const defaultPlaceholderExtension: FormlyExtension = {
  prePopulate(field): void {
    if (field.props?.placeholder !== undefined) {
      return;
    }

    if (field.type === 'select' || field.type === 'autocomplete') {
      field.props = {
        ...field.props,
        placeholder: VALUE_DEFUALT_SELECT_PLACEHOLDER,
      };
      return;
    }

    // FLAG_CLEANUP(FEATURE_FLAG_PLACEHOLDER_REMOVAL): Remove this block and the legacy constant once placeholders are permanently removed.
    if (!environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PLACEHOLDER_REMOVAL) {
      field.props = {
        ...field.props,
        placeholder: VALUE_DEFAULT_PLACEHOLDER,
      };
    }
  },
};

export const defaultAppearanceExtension: FormlyExtension = {
  prePopulate(field): void {
    if (field.props?.['appearance']) {
      return;
    }

    if (field.type === 'checkbox') {
      field.props = {
        ...field.props,
        appearance: 'fill',
      };
      return;
    }

    field.props = {
      ...field.props,
      floatLabel: 'always',
      appearance: 'outline',
    };
  },
};

/**
 * Explicitly sets aria-required="true" on required fields (WCAG 2.1 AA, ARIA Technique 2).
 * Angular Material already sets aria-required via the required binding – this extension
 * adds explicit redundancy as a belt-and-suspenders measure for all input/number fields.
 * For mat-select fields, aria-required is set internally by Angular Material.
 */
export const ariaRequiredExtension: FormlyExtension = {
  prePopulate(field): void {
    if (!field.type || !field.props?.required || field.props?.disabled) {
      return;
    }
    field.props = {
      ...field.props,
      attributes: {
        ...field.props?.attributes,
        'aria-required': 'true',
      },
    };
  },
};
