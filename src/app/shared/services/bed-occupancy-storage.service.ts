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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BedOccupancyNotifierFacility } from 'src/api/notification';
import { environment } from '../../../environments/environment';
import { HospitalLocation } from '../models/hospital-location';

@Injectable({
  providedIn: 'root',
})
export class BedOccupancyStorageService {
  constructor(private httpClient: HttpClient) {}

  fetchHospitalLocations(): Observable<HospitalLocation[]> {
    const ik = this.getIkNumber();
    return this.httpClient.get<HospitalLocation[]>(`${environment.pathToHospitalLocations}?ik=${ik}`, {
      headers: environment.headers,
    });
  }

  getIkNumber(): string {
    const jwt = window['token'];
    const payload = JSON.parse(atob(jwt.split('.')[1])); // Decode JWT payload
    const ik = payload.ik;
    // Check if 'ik' matches the regex pattern for 9 digits
    const regex = /^\d{9}$/;
    if (typeof ik === 'string' && regex.test(ik)) {
      return ik;
    }
    const preferredUsername = payload.preferred_username;
    if (!preferredUsername || !preferredUsername.startsWith('5-2-')) {
      console.warn(`the preferredUsername '${preferredUsername}' is blank or does not start with '5-2-'`);
      return null;
    }
    try {
      return preferredUsername.split('-')[2];
    } catch (ex) {
      console.warn(`failed to extract ik from preferredUsername ${preferredUsername} - ${ex.message}`);
      return null;
    }
  }

  setLocalStorageBedOccupancyData(ikNumber: string, data: BedOccupancyNotifierFacility): void {
    // Retrieve the existing bed occupancy object from local storage, or initialize a new object if none exists
    const bedOccupancy = JSON.parse(localStorage.getItem('bedOccupancy') || '{}');

    // Update the data for the given IK number
    bedOccupancy[ikNumber] = data;

    // Save the updated object back to local storage
    localStorage.setItem('bedOccupancy', JSON.stringify(bedOccupancy));
  }

  getLocalStorageBedOccupancyData(ikNumber: string): BedOccupancyNotifierFacility | null {
    // Retrieve the bed occupancy object from local storage
    const bedOccupancy = JSON.parse(localStorage.getItem('bedOccupancy') || '{}');

    // Return the data for the specified IK number, or null if it doesn't exist
    return bedOccupancy[ikNumber] || null;
  }

  saveBedOccupancyClipboardData(data: string): void {
    localStorage.setItem('clipboardData', data);
  }
}
