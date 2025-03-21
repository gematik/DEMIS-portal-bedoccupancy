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

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { FormlyConstants } from '../formly-constants';
import { formlyInputField } from '../reusable/commons';

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

export const questionBedOccupancyHtmlConfigFields: FormlyFieldConfig[] = [
  {
    className: FormlyConstants.LAYOUT_HEADER,
    template: '<h1>Belegte Betten auf den Normalstationen des meldenden Standortes</h1></div>',
  },
  {
    key: BedOccupancyConstants.OCCUPIED_BEDS,
    id: BedOccupancyConstants.OCCUPIED_BEDS,
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: numberOfBedsFieldGroup(true, 'occupied-beds-'),
  },
  {
    className: FormlyConstants.LAYOUT_HEADER,
    template: '<h1>Wenn Information vorhanden: <br> Betreibbare Betten auf den Normalstationen des meldenden Standortes</h1></div>',
  },
  {
    key: BedOccupancyConstants.OPERABLE_BEDS,
    id: BedOccupancyConstants.OPERABLE_BEDS,
    fieldGroupClassName: FormlyConstants.ROW,
    fieldGroup: numberOfBedsFieldGroup(false, 'operable-beds-'),
  },
];
