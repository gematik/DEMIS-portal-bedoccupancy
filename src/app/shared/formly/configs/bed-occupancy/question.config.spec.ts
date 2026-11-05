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
import { environment } from 'src/environments/environment';
import {
  getNumberOfBedsInputTexts,
  NUMBER_OF_BEDS_ERROR_MSG,
  NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_PORTAL_BED_TEXT,
  NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS,
  NUMBER_OF_BEDS_REQUIRED_ERROR_MSG,
  NUMBER_OF_BEDS_REQUIRED_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS,
  NUMBER_OF_BEDS_SUPPORT_TEXT,
  NUMBER_OF_BEDS_SUPPORT_TEXT_FEATURE_FLAG_BED_INPUT_TEXTS,
} from '../../../common-utils';
import { questionBedOccupancyHtmlConfigFields } from './question.config';
import { BedOccupancyConstants } from '../../../../bed-occupancy/common/bed-occupancy-constants';

// Retiring FEATURE_FLAG_PORTAL_BED_TEXT: remove this helper's parameter and flag entry; keep the remaining test configuration.
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

  // Retiring FEATURE_FLAG_PORTAL_BED_TEXT: keep this coverage, dropping only its explicit false setup.
  // Retiring FEATURE_FLAG_BED_INPUT_TEXTS: keep the new-text assertion as the baseline and remove the disabled/unset cases.
  describe('FEATURE_FLAG_BED_INPUT_TEXTS', () => {
    it('selects the new input texts independently of FEATURE_FLAG_PORTAL_BED_TEXT', () => {
      environment.bedOccupancyConfig = createTestConfig(false);
      environment.bedOccupancyConfig.featureFlags.FEATURE_FLAG_BED_INPUT_TEXTS = true;

      expect(getNumberOfBedsInputTexts()).toEqual({
        supportText: NUMBER_OF_BEDS_SUPPORT_TEXT_FEATURE_FLAG_BED_INPUT_TEXTS,
        requiredErrorMessage: NUMBER_OF_BEDS_REQUIRED_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS,
        errorMessage: NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_BED_INPUT_TEXTS,
      });
    });

    it.each([false, undefined])('preserves the existing text selection with FEATURE_FLAG_BED_INPUT_TEXTS=%s', inputTexts => {
      const existingTexts = getNumberOfBedsInputTexts();
      environment.bedOccupancyConfig.featureFlags.FEATURE_FLAG_BED_INPUT_TEXTS = inputTexts;

      expect(getNumberOfBedsInputTexts()).toEqual(existingTexts);
    });
  });

  it('returns intro text and detailed labels when FEATURE_FLAG_PORTAL_BED_TEXT is true', () => {
    const fields = questionBedOccupancyHtmlConfigFields();

    expect(fields).toHaveLength(5);
    expect(getTemplate(fields[0])).toContain('Die Anzahl der belegten Betten');
    expect(getTemplate(fields[0])).toContain('class="info-notification-text"');
    expect(getTemplate(fields[0])).toContain(
      'Für die Meldung ist der Bettenbelegungsstand des Vortages um 12:00 Uhr maßgeblich; die Übermittlung hat täglich bis 11:00 Uhr zu erfolgen.'
    );
    expect(fields.some(field => getTemplate(field).includes('bed-occupancy-section-heading--spaced'))).toBe(true);

    const occupiedSection = fields.find(field => field.key === BedOccupancyConstants.OCCUPIED_BEDS);
    const occupiedAdultsField = occupiedSection?.fieldGroup?.[0];
    const occupiedChildrenField = occupiedSection?.fieldGroup?.[1];

    expect(occupiedAdultsField?.props?.label).toBe(BedOccupancyConstants.OCCUPIED_BEDS_ADULTS_LABEL);
    expect(occupiedChildrenField?.props?.label).toBe(BedOccupancyConstants.OCCUPIED_BEDS_CHILDREN_LABEL);
    expect(occupiedAdultsField?.props?.required).toBe(true);
    expect(occupiedAdultsField?.type).toBe('number');
    expect(occupiedAdultsField?.props?.description).toBe(NUMBER_OF_BEDS_SUPPORT_TEXT);
    expect(occupiedChildrenField?.props?.description).toBe(NUMBER_OF_BEDS_SUPPORT_TEXT);
    const bedFields = fields
      .filter(field => field.fieldGroup)
      .flatMap(field => field.fieldGroup ?? [])
      .filter(field => field.type === 'number');
    expect(bedFields).toHaveLength(4);
    expect(bedFields.every(field => !field.props?.attributes || field.props.attributes['aria-describedby'] === undefined)).toBe(true);

    const validation = occupiedAdultsField?.validation as {
      messages: { required: () => string; min: () => string; max: () => string };
    };
    expect(validation.messages.required()).toBe(NUMBER_OF_BEDS_REQUIRED_ERROR_MSG);
    expect(validation.messages.min()).toBe(NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_PORTAL_BED_TEXT);
    expect(validation.messages.max()).toBe(NUMBER_OF_BEDS_ERROR_MSG_FEATURE_FLAG_PORTAL_BED_TEXT);
  });

  // Retiring FEATURE_FLAG_PORTAL_BED_TEXT: delete this disabled-variant test, not the FEATURE_FLAG_BED_INPUT_TEXTS coverage above.
  it('returns legacy labels and no intro text when FEATURE_FLAG_PORTAL_BED_TEXT is false', () => {
    environment.bedOccupancyConfig = createTestConfig(false);

    const fields = questionBedOccupancyHtmlConfigFields();

    expect(fields).toHaveLength(5);
    expect(getTemplate(fields[0])).toContain(
      'Für die Meldung ist der Bettenbelegungsstand des Vortages um 12:00 Uhr maßgeblich; die Übermittlung hat täglich bis 11:00 Uhr zu erfolgen.'
    );
    expect(fields.some(field => getTemplate(field).includes('bed-occupancy-section-heading--spaced'))).toBe(true);

    const occupiedSection = fields.find(field => field.key === BedOccupancyConstants.OCCUPIED_BEDS);
    const operableSection = fields.find(field => field.key === BedOccupancyConstants.OPERABLE_BEDS);

    expect(occupiedSection?.fieldGroup?.[0]?.props?.label).toBe('Erwachsene');
    expect(occupiedSection?.fieldGroup?.[1]?.props?.label).toBe('Kinder');
    expect(operableSection?.fieldGroup?.[0]?.props?.label).toBe('Erwachsene');
    expect(operableSection?.fieldGroup?.[1]?.props?.label).toBe('Kinder');
    expect(operableSection?.fieldGroup?.[0]?.props?.required).toBeUndefined();
    expect(occupiedSection?.fieldGroup?.[0]?.props?.description).toBeUndefined();
    expect(occupiedSection?.fieldGroup?.[0]?.props?.attributes?.['aria-describedby']).toBeUndefined();
    expect(operableSection?.fieldGroup?.[0]?.props?.attributes?.['aria-describedby']).toBeUndefined();
    const validation = occupiedSection?.fieldGroup?.[0]?.validation as {
      messages: { required?: () => string; min: () => string; max: () => string };
    };
    expect(validation.messages.required).toBeUndefined();
    expect(validation.messages.min()).toBe(NUMBER_OF_BEDS_ERROR_MSG);
    expect(validation.messages.max()).toBe(NUMBER_OF_BEDS_ERROR_MSG);
  });
});
