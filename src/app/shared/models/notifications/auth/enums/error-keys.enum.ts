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

export enum EErrorKeys {
  genericError = 'errorMessages.genericError',
  default = 'errorMessages.default',
  loggingErrorFailed = 'errorMessages.loggingErrorFailed',
  missingRoleAssignment = 'errorMessages.missingRoleAssignment',
  missmatchingRolesAssigned = 'errorMessages.missmatchingRolesAssigned',
  configFileForPocCannotBeFound = 'errorMessages.configFileForPocCannotBeFound',
  configFileForSmcbFailedToLoad = 'errorMessages.configFileForSmcbFailedToLoad',
  userHasNoPocRoleAssigned = 'errorMessages.userHasNoPocRoleAssigned',
  userHasMoreThanOnePocRolesAssigned = 'errorMessages.userHasMoreThanOnePocRolesAssigned',
  schemaForIDCannotBeFound = 'errorMessages.schemaForIDCannotBeFound',
  noSchemaSpecified = 'errorMessages.noSchemaSpecified',
  vaccineKeyCannotBeResolved = 'errorMessages.vaccineKeyCannotBeResolved',
  http400 = 'anchoringFetchErrors.400',
  http401 = 'anchoringFetchErrors.401',
  http403 = 'anchoringFetchErrors.403',
  http500 = 'anchoringFetchErrors.500',
  http504 = 'anchoringFetchErrors.504',
  http401Smcb = 'anchoringFetchErrors.401Smcb',
  hashForAnchoringIsEmpty = 'anchoringFetchErrors.hashForAnchoringIsEmpty',
  missingFormFields = 'anchor-form.error.missing-fields',
  triedToCreateFilenameFromUndefFields = 'errorMessages.triedToCreateFilenameFromUndefFields',
  nextVaccinationAfterCurrent = 'vaccinationAnchorForm.errors.nextVaccinationAfterCurrent',
  fromDateMustBeBeforeUntilDate = 'certifAnchorForm.errors.fromDateMustBeBeforeUntilDate',
  anchoringFailed = 'errorMessages.anchoringFailed',
  jsonDataIncomplete = 'errorMessages.jsonDataIncomplete',
  dgcValidationFailed = 'errorMessages.dgcValidationFailed',
  formForSchemaIdMissing = 'errorMessages.formForSchemaIdMissing',
  errorCodeBsnrMissingForKVUser = 'errorMessages.errorCodeBsnrMissingForKVUser',
  errorCodeBsnrMissingForSmcbUser = 'errorMessages.errorCodeBsnrMissingForSmcbUser',
  smcbAuthFailed = 'errorMessages.smcbAuthFailed',
  pageNotFound = 'errorMessages.notFound',
  selectedVaccineNotAllowedAsBaseImmun = 'errorMessages.selectedVaccineNotAllowedAsBaseImmun',
  selectedVaccineNotAllowedAsBooster = 'errorMessages.selectedVaccineNotAllowedAsBooster',
  selectedVaccineNotAllowedAsBoosterAfterSelectedBase = 'errorMessages.selectedVaccineNotAllowedAsBoosterAfterSelectedBase',
}

export enum EErrorTitles {
  userHasMoreThanOnePocRolesAssignedTitle = 'errorMessages.userHasMoreThanOnePocRolesAssignedTitle',
  genericErrorTitle = 'errorMessages.genericErrorTitle',
  missingRoleAssignmentTitle = 'errorMessages.missingRoleAssignmentTitle',
  configFileForPocCannotBeFoundTitle = 'errorMessages.configFileForPocCannotBeFoundTitle',
  http401Title = 'anchoringFetchErrors.401Title',
  configIncompleteTitle = 'errorMessages.configIncompleteTitle',
  pageNotFoundTitle = 'errorMessages.notFoundTitle',
  configFileForSmcbFailedToLoadTitle = 'errorMessages.configFileForSmcbFailedToLoadTitle',
  http401SmcbTitle = 'anchoringFetchErrors.401SmcbTitle',
  smcbAuthFailedTitle = 'errorMessages.smcbAuthFailedTitle',
}

export enum EErrorKeysMap {
  nextVaccinationAfterCurrent = 'nextVaccinationAfterCurrent',
  birthDateOrPassRequired = 'birthDateOrPassRequired',
}
