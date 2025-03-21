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



import { EErrorKeys } from './error-keys.enum';

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

/*** ERROR CODES, divided into groups:
 *  11xx - general
 *  12xx - configuration
 *  13xx - anchoring
 *  14xx - print
 *  19xx - other
 **/
export const ErrorCodes: Record<EErrorKeys, number> = {
  [EErrorKeys.pageNotFound]: 404,
  [EErrorKeys.genericError]: 1100,
  [EErrorKeys.default]: 1101,
  [EErrorKeys.loggingErrorFailed]: 1102,
  [EErrorKeys.smcbAuthFailed]: 1103,

  [EErrorKeys.schemaForIDCannotBeFound]: 1201,
  [EErrorKeys.userHasNoPocRoleAssigned]: 1202,
  [EErrorKeys.userHasMoreThanOnePocRolesAssigned]: 1203,
  [EErrorKeys.errorCodeBsnrMissingForKVUser]: 1204,
  [EErrorKeys.formForSchemaIdMissing]: 1205,
  [EErrorKeys.noSchemaSpecified]: 1206,
  [EErrorKeys.missingFormFields]: 1207,
  [EErrorKeys.missingRoleAssignment]: 1208,
  [EErrorKeys.missmatchingRolesAssigned]: 1209,
  [EErrorKeys.configFileForPocCannotBeFound]: 1210,
  [EErrorKeys.configFileForSmcbFailedToLoad]: 1211,
  [EErrorKeys.errorCodeBsnrMissingForSmcbUser]: 1212,
  [EErrorKeys.vaccineKeyCannotBeResolved]: 1215,

  [EErrorKeys.anchoringFailed]: 1300,
  [EErrorKeys.jsonDataIncomplete]: 1301,
  [EErrorKeys.dgcValidationFailed]: 1302,
  [EErrorKeys.http400]: 1303,
  [EErrorKeys.http401]: 1304,
  [EErrorKeys.http403]: 1305,
  [EErrorKeys.http500]: 1306,
  [EErrorKeys.http504]: 1307,
  [EErrorKeys.hashForAnchoringIsEmpty]: 1308,
  [EErrorKeys.http401Smcb]: 1309,

  [EErrorKeys.triedToCreateFilenameFromUndefFields]: 1401,

  [EErrorKeys.nextVaccinationAfterCurrent]: 1901,
  [EErrorKeys.fromDateMustBeBeforeUntilDate]: 1901,
  [EErrorKeys.selectedVaccineNotAllowedAsBooster]: 1910,
  [EErrorKeys.selectedVaccineNotAllowedAsBoosterAfterSelectedBase]: 1911,
  [EErrorKeys.selectedVaccineNotAllowedAsBaseImmun]: 1915,
};
