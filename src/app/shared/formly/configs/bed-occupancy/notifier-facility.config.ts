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

import { FormlyFieldConfig } from '@ngx-formly/core';
import { environment } from 'src/environments/environment';

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { EMPTY_DROPDOWN_MENU_MSG, GERMANY_COUNTRY_CODE } from '../../../common-utils';
import { HospitalLocation } from '../../../models/hospital-location';
import { FormlyConstants } from '../formly-constants';
import { addressFormConfigFields } from '../reusable/address.config';
import { formlyIntro } from '../reusable/commons';
import { contactsFormConfigFields } from '../reusable/contacts.config';
import { oneTimeCodeConfigField } from '../reusable/oneTimeCode.config';
import { practitionerInfoFormConfigFields } from '../reusable/practitioner-info.config';

const isPortalBedTextEnabled = (): boolean => environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_PORTAL_BED_TEXT ?? false;
const isA11yRequiredFieldsInfoEnabled = (): boolean => environment.bedOccupancyConfig?.featureFlags?.FEATURE_FLAG_BED_A11Y_INFO_REQUIREDFIELDS ?? false;

function setData(field: FormlyFieldConfig, hospitalLocation: HospitalLocation, ikNumber: string) {
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
  const notifierFacilityText = isPortalBedTextEnabled()
    ? `<div role="note">
    <div class="info-notification-text"><span class="material-icons-outlined primary-color-icon" aria-hidden="true">error_outline</span><span class="message">Jedes Krankenhaus kann über einen oder mehrere Krankenhausstandorte verfügen. Die Standorte zugelassener deutscher Krankenhäuser sind im <a href="https://krankenhausstandorte.de/login" target="_blank" rel="noopener noreferrer" aria-label="InEK-Standort-Verzeichnis auf krankenhausstandorte.de in neuem Tab öffnen" style="text-decoration: underline">InEK-Standort-Verzeichnis</a> mit eindeutiger Standort-ID gemäß § 8 Abs. 1 der Standortverzeichnisvereinbarung registriert. Die Anzahl der belegten Betten muss für jeden Krankenhausstandort täglich separat gemeldet werden. Die Meldung bezieht sich nur auf Standorte, denen eine Einrichtung mit Einrichtungstyp '00' zugeordnet ist.
    <br><br>Die Auswahl der Standortnamen wird anhand der bei der Authentifikation verwendeten SMC-B automatisch aus dem InEK-Standort-Verzeichnis vorausgefüllt.</span></div>
    </div>`
    : `<div role="note">
    <p>Hier werden Angaben des Krankenhausstandortes erwartet, für den die tägliche Meldung der betreibbaren und belegten Betten erfolgen soll.</p>
    <p>Die Statistik der betreibbaren und belegten Betten bezieht sich NICHT nur auf COVID-19, sondern auf alle betreibbaren und belegten Betten im Krankenhaus.</p>
    <p>Die Informationen aus den Eingabefeldern zur meldenden Person werden lokal im aktuellen Browser gespeichert. Bei Folgemeldungen werden diese Eingabefelder automatisch mit den gespeicherten Daten vorbefüllt, damit der Meldevorgang beschleunigt wird.</p>
    <div class="info-notification-text"><span class="material-icons-outlined primary-color-icon" aria-hidden="true">error_outline</span><span class="message">Bitte die Adresse des Krankenhausstandortes auswählen, für den die Meldung erfolgt.</span></div>
    </div>`;

  return [
    formlyIntro(notifierFacilityText, isA11yRequiredFieldsInfoEnabled()),
    {
      className: FormlyConstants.LAYOUT_HEADER,
      template: '<h2>Einrichtung</h2>',
    },
    {
      className: 'error-text',
      template: `<h3><span class="material-icons-outlined primary-color-icon" aria-hidden="true">error_outline</span> ${EMPTY_DROPDOWN_MENU_MSG}</h3>`,
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
              const hospitalLocation = hospitalLocations.find(f => field.formControl.value === f.label);
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
          className: FormlyConstants.COLMD12,
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
      template: '<h2>Ansprechperson (meldende Person)</h2>',
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
