/*
    Copyright (c) 2025 gematik GmbH
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
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { Injectable } from '@angular/core';
import { BedOccupancy, BedOccupancyNotifierFacility, BedOccupancyQuestion, OccupiedBeds, OperableBeds } from 'src/api/notification';
import { checkNumberOfBeds } from '../notification-form-validation-module';
import { ValidateNotificationService } from '../services/validate-notification.service';

@Injectable({
  providedIn: 'root',
})
export class ValidateBedOccupancyNotificationService {
  constructor(private validator: ValidateNotificationService) {}

  validateNotification(bedOccupancy: BedOccupancy): boolean {
    return (
      !!bedOccupancy && this.bedOccupancyNotifierFacility(bedOccupancy.notifierFacility) && this.validateBedOccupancyQuestion(bedOccupancy.bedOccupancyQuestion)
    );
  }

  bedOccupancyNotifierFacility(notifierFacility: BedOccupancyNotifierFacility): boolean {
    return this.isBedOccupancyNotifierFacilityValid(notifierFacility) && this.validator.validateNotifierFacilityBedOccupancyTemp(notifierFacility);
  }

  private isBedOccupancyNotifierFacilityValid(notifierFacility: BedOccupancyNotifierFacility): boolean {
    return this.isInstitutionNameSelected(notifierFacility.facilityInfo.institutionName);
  }

  private isInstitutionNameSelected(institutionName: string): boolean {
    return !!institutionName;
  }

  /**
   * @param bedOccupancyQuestion
   * returns false when bedOccupancyQuestion is invalid
   */
  validateBedOccupancyQuestion(bedOccupancyQuestion: BedOccupancyQuestion): boolean {
    return this.validateOccupiedBeds(bedOccupancyQuestion.occupiedBeds) && this.validateOperableBeds(bedOccupancyQuestion.operableBeds);
  }

  private validateOccupiedBeds(occupiedBeds: OccupiedBeds): boolean {
    const mandatoryChildren = occupiedBeds.childrenNumberOfBeds;
    const mandatoryAdults = occupiedBeds.adultsNumberOfBeds;
    return !!mandatoryChildren && !!mandatoryAdults
      ? !checkNumberOfBeds(mandatoryAdults.toString()) && !checkNumberOfBeds(mandatoryChildren.toString()) // both mandatory fields are valid
      : false;
  }

  private validateOperableBeds(operableBeds: OperableBeds): boolean {
    const obligatoryChildren = operableBeds.childrenNumberOfBeds;
    const obligatoryAdults = operableBeds.adultsNumberOfBeds;
    return !!obligatoryChildren
      ? !!obligatoryAdults
        ? !checkNumberOfBeds(obligatoryChildren.toString())
          ? !checkNumberOfBeds(obligatoryAdults.toString())
          : false
        : !checkNumberOfBeds(obligatoryChildren.toString())
      : obligatoryAdults
        ? !checkNumberOfBeds(obligatoryAdults.toString())
        : true;
  }
}
