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
import { EMPTY_DROPDOWN_MENU_MSG, GERMANY_COUNTRY_CODE } from '../../../common-utils';
import { HospitalLocation } from '../../../models/hospital-location';
import { FormlyConstants } from '../formly-constants';
import { addressFormConfigFields } from '../reusable/address.config';
import { contactsFormConfigFields } from '../reusable/contacts.config';
import { oneTimeCodeConfigField } from '../reusable/oneTimeCode.config';
import { practitionerInfoFormConfigFields } from '../reusable/practitioner-info.config';
import { formlyInputField } from '../reusable/commons';

function setData(field: FormlyFieldConfig, hospitalLocation: any, ikNumber: string) {
  field?.parent?.parent?.formControl?.patchValue({
    address: {
      ...field?.parent?.parent?.formControl?.value.address,
      zip: hospitalLocation.postalCode,
      city: hospitalLocation.city,
      street: hospitalLocation.line,
      houseNumber: hospitalLocation.houseNumber,
      country: GERMANY_COUNTRY_CODE,
    },
    locationID: hospitalLocation.id,
    ikNumber: ikNumber,
  });
}

function notifierFacilityBedOccupancyHtmlConfigFields(ikNumber: string, hospitalLocations: HospitalLocation[]): FormlyFieldConfig[] {
  return [
    {
      className: FormlyConstants.LAYOUT_TEXT,
      template: `<div>
    <p>Hier werden Angaben des Krankenhausstandortes erwartet, für den die tägliche Meldung der betreibbaren und belegten Betten erfolgen soll.</p>
    <p>Die Statistik der betreibbaren und belegten Betten bezieht sich NICHT nur auf COVID-19, sondern auf alle betreibbaren und belegten Betten im Krankenhaus.</p>
    <p>Die Informationen aus den Eingabefeldern zur meldenden Person werden lokal im aktuellen Browser gespeichert. Bei Folgemeldungen werden diese Eingabefelder automatisch mit den gespeicherten Daten vorbefüllt, damit der Meldevorgang beschleunigt wird.</p>
    <p><div class="info-notification-text"><span class="material-icons md-48">info_outline</span><span class="message">Bitte die Adresse des Krankenhausstandortes auswählen, für den die Meldung erfolgt.</span></div></p>
    </div>`,
      props: {
        addonLeft: {
          icon: 'info_outline',
        },
      },
    },
    {
      className: FormlyConstants.LAYOUT_HEADER,
      template: '<h2>Einrichtung</h2>',
    },
    {
      className: 'error-text',
      template: `<h4><span class="material-icons md-48">info_outline</span> ${EMPTY_DROPDOWN_MENU_MSG}</h4>`,
      expressions: { hide: () => hospitalLocations.length > 0 },
    },
    {
      fieldGroupClassName: FormlyConstants.ROW,
      key: 'facilityInfo',
      fieldGroup: [
        {
          key: BedOccupancyConstants.IK_NUMBER_KEY,
          id: BedOccupancyConstants.IK_NUMBER_KEY,
          className: FormlyConstants.LAYOUT_FULL_LINE,
          type: 'input',
          defaultValue: ikNumber,
          props: {
            label: BedOccupancyConstants.INSTITUTION_IDENTIFIER_LABEL,
            required: true,
            disabled: true,
          },
        },
        {
          key: BedOccupancyConstants.INSTITUTION_NAME_KEY,
          id: BedOccupancyConstants.INSTITUTION_NAME_KEY,
          className: FormlyConstants.LAYOUT_FULL_LINE,
          type: 'select',
          defaultValue: '',
          props: {
            label: BedOccupancyConstants.INSTITUTION_NAME_LABEL,
            options: hospitalLocations.map(h => {
              return { label: h.label, value: h.label };
            }),
            required: true,
            change: field => {
              //@ts-ignore
              const hospitalLocation = hospitalLocations.filter(f => field.formControl.value === f.label)[0];
              setData(field, hospitalLocation, ikNumber);
            },
          },
        },
      ],
    },
    {
      className: '',
      template: '<h2>Adresse</h2>',
    },
    {
      fieldGroupClassName: FormlyConstants.ROW,
      fieldGroup: [
        {
          key: BedOccupancyConstants.LOCATION_ID_KEY,
          id: BedOccupancyConstants.LOCATION_ID_KEY,
          className: FormlyConstants.COLMD11,
          type: 'input',
          props: {
            label: BedOccupancyConstants.LOCATION_ID_LABEL,
            required: true,
            disabled: true,
          },
        },
        {
          key: 'address',
          fieldGroupClassName: FormlyConstants.ROW,
          fieldGroup: addressFormConfigFields(true, '', true),
        },
      ],
    },
    {
      template: '<h2>Ansprechperson (Melder)</h2>',
    },
    practitionerInfoFormConfigFields,
    oneTimeCodeConfigField,
    {
      template: '<h2>Kontaktmöglichkeiten</h2>',
    },
  ];
}

export function notifierFacilityBedOccupancyFormConfigFields(ikNumber: string, hospitalLocations: HospitalLocation[]): FormlyFieldConfig[] {
  return notifierFacilityBedOccupancyHtmlConfigFields(ikNumber, hospitalLocations).concat(contactsFormConfigFields(true));
}
