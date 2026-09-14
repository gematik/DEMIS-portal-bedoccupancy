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

import { beforeEach, describe, expect, it } from 'vitest';

import { BedOccupancyConstants } from 'src/app/bed-occupancy/common/bed-occupancy-constants';
import { NUMBER_OF_BEDS_ERROR_MSG } from '../../../common-utils';
import { questionBedOccupancyHtmlConfigFieldsNew } from './question-new.config';
import { environment } from 'src/environments/environment';

const createTestConfig = (isPortalBedTextEnabled: boolean) => ({
  production: false,
  pathToGateway: '/gateway',
  pathToHospitalLocations: '/hospital-locations',
  ngxLoggerConfig: {
    level: 0,
    disableConsoleLogging: true,
    serverLogLevel: 0,
  },
  featureFlags: {
    FEATURE_FLAG_PORTAL_BED_TEXT: isPortalBedTextEnabled,
  },
});

describe('question-new.config', () => {
  beforeEach(() => {
    environment.bedOccupancyConfig = createTestConfig(true);
  });

  const getTemplate = (field: any): string => String(field?.template ?? field?.fieldGroup?.[0]?.template ?? '');

  it('returns intro text and detailed labels when FEATURE_FLAG_PORTAL_BED_TEXT is true', () => {
    const fields = questionBedOccupancyHtmlConfigFieldsNew();

    expect(fields.length).toBe(5);
    expect(getTemplate(fields[0])).toContain('Die Anzahl der belegten Betten');

    const occupiedSection = fields.find(field => field.key === BedOccupancyConstants.OCCUPIED_BEDS);
    const occupiedAdultsField = occupiedSection?.fieldGroup?.[0];
    const occupiedChildrenField = occupiedSection?.fieldGroup?.[1];

    expect(occupiedAdultsField?.props?.label).toBe(BedOccupancyConstants.OCCUPIED_BEDS_ADULTS_LABEL);
    expect(occupiedChildrenField?.props?.label).toBe(BedOccupancyConstants.OCCUPIED_BEDS_CHILDREN_LABEL);
    expect(occupiedAdultsField?.props?.required).toBe(true);
    expect(occupiedAdultsField?.type).toBe('number');

    const validation = occupiedAdultsField?.validation as { messages: { min: () => string; max: () => string } };
    expect(validation.messages.min()).toBe(NUMBER_OF_BEDS_ERROR_MSG);
    expect(validation.messages.max()).toBe(NUMBER_OF_BEDS_ERROR_MSG);
  });

  it('returns legacy labels and no intro text when FEATURE_FLAG_PORTAL_BED_TEXT is false', () => {
    environment.bedOccupancyConfig = createTestConfig(false);

    const fields = questionBedOccupancyHtmlConfigFieldsNew();

    expect(fields.length).toBe(4);

    const occupiedSection = fields.find(field => field.key === BedOccupancyConstants.OCCUPIED_BEDS);
    const operableSection = fields.find(field => field.key === BedOccupancyConstants.OPERABLE_BEDS);

    expect(occupiedSection?.fieldGroup?.[0]?.props?.label).toBe('Erwachsene');
    expect(occupiedSection?.fieldGroup?.[1]?.props?.label).toBe('Kinder');
    expect(operableSection?.fieldGroup?.[0]?.props?.label).toBe('Erwachsene');
    expect(operableSection?.fieldGroup?.[1]?.props?.label).toBe('Kinder');
    expect(operableSection?.fieldGroup?.[0]?.props?.required).toBeUndefined();
  });
});
