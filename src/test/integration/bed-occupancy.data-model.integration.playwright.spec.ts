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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BedOccupancyClipboardDataService } from 'src/app/bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { BedOccupancyStorageService } from 'src/app/shared/services/bed-occupancy-storage.service';
import { FhirBedOccupancyService } from '../../app/shared/services/fhir-bed-occupancy.service';
import { BedOccupancyComponent } from '../../app/bed-occupancy/bed-occupancy.component';
import { configureIntegrationTestBed, TEST_DATA } from './bed-occupancy.integration-setup';

describe('Bed Occupancy with new sidenav  - Data Model Tests with playwright', () => {
  let fixture: ComponentFixture<BedOccupancyComponent>;

  beforeEach(async () => {
    await configureIntegrationTestBed();
    fixture = TestBed.createComponent(BedOccupancyComponent);
    vi.spyOn(TestBed.inject(FhirBedOccupancyService), 'transformData');
    vi.spyOn(TestBed.inject(BedOccupancyStorageService), 'setLocalStorageBedOccupancyData');
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  const locate = (selector: string) => {
    const element = fixture.nativeElement.querySelector(selector) as Element | null;
    if (!element) {
      throw new Error(`Element not found for selector: ${selector}`);
    }
    return page.elementLocator(element);
  };

  async function selectMatOption(triggerSelector: string, optionText: string) {
    await userEvent.click(locate(triggerSelector));

    const option = Array.from(document.querySelectorAll('mat-option')).find(el => el.textContent?.trim().includes(optionText)) as HTMLElement | undefined;
    if (!option) {
      throw new Error(`mat-option "${optionText}" not found for trigger "${triggerSelector}"`);
    }
    await userEvent.click(option);
  }

  it('should handle magic (aka HexHex) button click', async () => {
    await userEvent.click(locate('#btn-magic'));

    await expect.element(locate('#btn-send-notification')).toBeEnabled();
  });

  it('should send, when form is filled correctly with the help from the clipboard', async () => {
    // Form page 1
    await selectMatOption('#institutionName', TEST_DATA.hospitalLocation.label);
    await userEvent.fill(locate('#firstname'), 'Homer');
    await userEvent.fill(locate('#lastname'), 'Simpson');
    await userEvent.fill(locate('input[id*="phoneNo"]'), '0800123456');
    await userEvent.fill(locate('input[id*="email"]'), 'homer@simpson.com');

    await userEvent.click(locate('#btn-nav-action-next'));

    // Form page 2 - filled from clipboard
    // Parse the clipboard data as the PasteBox component would
    const clipboardString = 'B.adultsOccupied=47&B.childrenOccupied=11&B.adultsOperable=33&B.childrenOperable=5';
    const clipboardMap = new Map<string, string>();
    clipboardString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      clipboardMap.set(key, value);
    });

    // Call the service method directly to update the clipboard data
    TestBed.inject(BedOccupancyClipboardDataService).updateBedOccupancy(clipboardMap);

    await expect.element(locate('#btn-send-notification')).toBeEnabled();
  });
});
