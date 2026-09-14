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

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { EMPTY_DROPDOWN_MENU_MSG } from '../../../common-utils';
import { HospitalLocation } from '../../../models/hospital-location';
import { notifierFacilityBedOccupancyFormConfigFields } from './notifier-facility.config';
import { environment } from 'src/environments/environment';

describe('notifier-facility.config', () => {
  const ikNumber = '123456789';
  const hospitalLocations: HospitalLocation[] = [
    {
      id: 42,
      ik: ikNumber,
      label: 'Test Krankenhaus',
      postalCode: '12345',
      city: 'Berlin',
      line: 'Musterstrasse',
      houseNumber: '7',
    },
  ];

  beforeEach(() => {
    environment.bedOccupancyConfig = {
      featureFlags: {
        FEATURE_FLAG_PORTAL_BED_TEXT: true,
      },
    };
  });

  const getTemplate = (field: any): string => String(field?.template ?? field?.fieldGroup?.[0]?.template ?? '');

  it('returns new notifier text when FEATURE_FLAG_PORTAL_BED_TEXT is true', () => {
    const fields = notifierFacilityBedOccupancyFormConfigFields(ikNumber, hospitalLocations);
    const introText = getTemplate(fields[0]);

    expect(introText).toContain('InEK-Standort-Verzeichnis');
    expect(introText).toContain('SMC-B');
  });

  it('returns legacy notifier text when FEATURE_FLAG_PORTAL_BED_TEXT is false', () => {
    environment.bedOccupancyConfig = {
      featureFlags: {
        FEATURE_FLAG_PORTAL_BED_TEXT: false,
      },
    };

    const fields = notifierFacilityBedOccupancyFormConfigFields(ikNumber, hospitalLocations);
    const introText = getTemplate(fields[0]);

    expect(introText).toContain('Hier werden Angaben des Krankenhausstandortes erwartet');
    expect(introText).toContain('NICHT nur auf COVID-19');
  });

  it('sets default IK and maps hospital options', () => {
    const fields = notifierFacilityBedOccupancyFormConfigFields(ikNumber, hospitalLocations);
    const facilityInfo = fields.find(field => field.key === 'facilityInfo');
    const ikField = facilityInfo?.fieldGroup?.[0];
    const institutionNameField = facilityInfo?.fieldGroup?.[1];

    expect(ikField?.key).toBe(BedOccupancyConstants.IK_NUMBER_KEY);
    expect(ikField?.defaultValue).toBe(ikNumber);
    expect(institutionNameField?.props?.options).toEqual([{ label: 'Test Krankenhaus', value: 'Test Krankenhaus' }]);
  });

  it('shows dropdown error only when no hospital locations are available', () => {
    const fieldsWithoutLocations = notifierFacilityBedOccupancyFormConfigFields(ikNumber, []);
    const dropdownError = fieldsWithoutLocations.find(field => String(field.template).includes(EMPTY_DROPDOWN_MENU_MSG));
    const hideWithoutLocations = dropdownError?.expressions?.hide as (() => boolean) | undefined;

    expect(hideWithoutLocations?.()).toBe(false);

    const fieldsWithLocations = notifierFacilityBedOccupancyFormConfigFields(ikNumber, hospitalLocations);
    const hiddenDropdownError = fieldsWithLocations.find(field => String(field.template).includes(EMPTY_DROPDOWN_MENU_MSG));
    const hideWithLocations = hiddenDropdownError?.expressions?.hide as (() => boolean) | undefined;

    expect(hideWithLocations?.()).toBe(true);
  });

  it('updates address and ids via select change callback', () => {
    const fields = notifierFacilityBedOccupancyFormConfigFields(ikNumber, hospitalLocations);
    const facilityInfo = fields.find(field => field.key === 'facilityInfo');
    const institutionNameField = facilityInfo?.fieldGroup?.[1];
    const changeHandler = institutionNameField?.props?.change as ((field: any) => void) | undefined;

    const patchValue = vi.fn();
    const fieldArg = {
      formControl: { value: 'Test Krankenhaus' },
      parent: {
        parent: {
          formControl: {
            value: {
              address: {
                country: 'DE',
              },
            },
            patchValue,
          },
        },
      },
    };

    changeHandler?.(fieldArg);

    expect(patchValue).toHaveBeenCalledWith({
      address: {
        country: 'DE',
        zip: '12345',
        city: 'Berlin',
        street: 'Musterstrasse',
        houseNumber: '7',
      },
      locationID: 42,
      ikNumber,
    });
  });

  it('appends contacts section to the form config', () => {
    const fields = notifierFacilityBedOccupancyFormConfigFields(ikNumber, hospitalLocations);

    expect(fields.some(field => field.key === 'contacts')).toBe(true);
  });
});
