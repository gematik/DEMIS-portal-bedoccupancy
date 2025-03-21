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



import {
  AddressType,
  Diagnosis,
  DiseaseInfoCommon,
  HospitalizationQuestion,
  InfectionProtectionFacilityInfo,
  MethodPathogenDTO,
  NotifiedPersonBasicInfo,
  PathogenDiagnostic,
  PractitionerInfo,
  VaccinationInfo,
} from 'src/api/notification';
import { HospitalizationConstants } from './hospitalization-constants';

import GenderEnum = NotifiedPersonBasicInfo.GenderEnum;
import SalutationEnum = PractitionerInfo.SalutationEnum;
import MilitaryEnum = DiseaseInfoCommon.MilitaryEnum;
import VaccineEnum = VaccinationInfo.VaccineEnum;
import TestTypeEnum = Diagnosis.TestTypeEnum;
import HospitalizedEnum = HospitalizationQuestion.HospitalizedEnum;
import RoleEnum = InfectionProtectionFacilityInfo.RoleEnum;
import ResultEnum = MethodPathogenDTO.ResultEnum;
import ReportStatusEnum = PathogenDiagnostic.ReportStatusEnum;

export const ADDRESS_TYPE_OPTION_LIST = [
  { value: AddressType.Current, label: 'Derzeitiger Aufenthaltsort' },
  { value: AddressType.Ordinary, label: 'Gewöhnlicher Aufenthaltsort' },
  { value: AddressType.Primary, label: 'Hauptwohnsitz' },
];

export const EXIST_BS_NR_OPTION_LIST = [
  { value: true, label: 'Vorhanden' },
  { value: false, label: 'Nicht vorhanden' },
];

export const GENDER_OPTION_LIST = [
  { value: GenderEnum.Male, label: 'Männlich' },
  { value: GenderEnum.Female, label: 'Weiblich' },
  { value: GenderEnum.Other, label: 'Divers' },
  { value: GenderEnum.Unknown, label: 'Keine Angabe' },
];

export const INFECT_PROTECT_FACILITY_INFO_OPTION_LIST = [
  {
    value: RoleEnum.Employment,
    label: HospitalizationConstants.EMPLOYMENT_LABEL,
  },
  { value: RoleEnum.Care, label: HospitalizationConstants.CARE_LABEL },
  {
    value: RoleEnum.Accommodation,
    label: HospitalizationConstants.ACCOMMODATION_LABEL,
  },
];

export const INSTITUTION_TYPE_OPTION_LIST = [
  { value: 'work', label: 'Dienstlich' },
  { value: 'home', label: 'Privat' },
];

export const MILITARY_OPTION_LIST = [
  {
    value: MilitaryEnum.Unknown,
    label: HospitalizationConstants.UNKNOWN_LABEL,
  },
  {
    value: MilitaryEnum.Indeterminate,
    label: HospitalizationConstants.INDETERMINATE_LABEL,
  },
  {
    value: MilitaryEnum.Soldier,
    label: HospitalizationConstants.MILITARY_SOLDIER_LABEL,
  },
  {
    value: MilitaryEnum.CivilianInMilitaryFacility,
    label: HospitalizationConstants.CIVILIAN_IN_MILITARY_FACILITY_LABEL,
  },
  {
    value: MilitaryEnum.UnrelatedToMilitary,
    label: HospitalizationConstants.UNRELATED_TO_MILITARY_LABEL,
  },
];

export const SALUTATION_OPTION_LIST = [
  { value: SalutationEnum.Mrs, label: 'Frau' },
  { value: SalutationEnum.Mr, label: 'Herr' },
];

export const SYMPTOMS_OPTION_LIST = [];

export const TEST_TYPE_OPTION_LIST = [
  { value: TestTypeEnum.AntigenRapidTest, label: 'Antigenschnelltest' },
  {
    value: TestTypeEnum.NucleicAcidCertificate,
    label: 'Nukleinsäurenachweis, z.B. PCR',
  },
  { value: TestTypeEnum.PcrRapidTest, label: 'PCR-Schnelltest' },
];

export const VACCINE_OPTION_LIST = [
  {
    value: VaccineEnum.Comirnaty,
    label: HospitalizationConstants.COMIRNATY_LABEL,
  },
  { value: VaccineEnum.Janssen, label: HospitalizationConstants.JANSSEN_LABEL },
  { value: VaccineEnum.Moderna, label: HospitalizationConstants.MODERNA_LABEL },
  {
    value: VaccineEnum.Nuvaxovid,
    label: HospitalizationConstants.NUVAXOVID_LABEL,
  },
  {
    value: VaccineEnum.Vaxzevria,
    label: HospitalizationConstants.VAXZEVRIA_LABEL,
  },
  {
    value: VaccineEnum.Valneva,
    label: HospitalizationConstants.VALNEVA_LABEL,
  },
  { value: VaccineEnum.Other, label: HospitalizationConstants.OTHER_LABEL },
  {
    value: VaccineEnum.Indeterminate,
    label: HospitalizationConstants.INDETERMINATE_LABEL,
  },
  { value: VaccineEnum.Unknown, label: HospitalizationConstants.UNKNOWN_LABEL },
];

export const YES_NO_OPTION_LIST = [
  { value: HospitalizedEnum.Yes, label: HospitalizationConstants.YES_LABEL },
  { value: HospitalizedEnum.No, label: HospitalizationConstants.No_LABEL },
];

export const YES_NO_INDETERMINATE_UNKNOWN_OPTION_LIST = [
  ...YES_NO_OPTION_LIST,
  {
    value: HospitalizedEnum.Indeterminate,
    label: HospitalizationConstants.INDETERMINATE_LABEL,
  },
  {
    value: HospitalizedEnum.Unknown,
    label: HospitalizationConstants.UNKNOWN_LABEL,
  },
];

export const RESULT_OPTION_LIST = [
  { value: ResultEnum.Pos, label: 'Positiv' },
  { value: ResultEnum.Neg, label: 'Negativ' },
];

export const REPORT_STATUS_OPTION_LIST = [
  { value: ReportStatusEnum.Final, label: 'Endgültig' },
  { value: ReportStatusEnum.Preliminary, label: 'Vorläufig' },
  { value: ReportStatusEnum.Amended, label: 'Ergänzung oder Korrektur' },
];
