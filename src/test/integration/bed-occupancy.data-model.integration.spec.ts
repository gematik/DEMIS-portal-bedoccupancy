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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BedOccupancyClipboardDataService } from 'src/app/bed-occupancy/services/clipboard/bed-occupancy-clipboard-data.service';
import { BedOccupancyStorageService } from 'src/app/shared/services/bed-occupancy-storage.service';
import { FhirBedOccupancyService } from '../../app/shared/services/fhir-bed-occupancy.service';
import { getButton, getInput, getSelect, selectOption } from '../shared/material-harness-utils';
import { getHtmlButtonElement } from '../shared/html-element-utils';
import { BedOccupancyComponent } from '../../app/bed-occupancy/bed-occupancy.component';
import { configureIntegrationTestBed, TEST_DATA } from './bed-occupancy.integration-setup';

// TODO: We've decided to go with Playwright. We need to determine whether these tests can be permanently removed.
describe.skip('Bed Occupancy with new sidenav  - Data Model Tests', () => {
  let fixture: ComponentFixture<BedOccupancyComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await configureIntegrationTestBed();
    fixture = TestBed.createComponent(BedOccupancyComponent);
    vi.spyOn(TestBed.inject(FhirBedOccupancyService), 'transformData');
    vi.spyOn(TestBed.inject(BedOccupancyStorageService), 'setLocalStorageBedOccupancyData');
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should handle magic (aka HexHex) button click', async () => {
    const hexHexButton = getHtmlButtonElement(fixture.nativeElement, '#btn-magic');
    hexHexButton.click();

    const submitButton = await getButton(loader, '#btn-send-notification');

    expect(await submitButton.isDisabled()).toBe(false);
  });

  it('should send, when form is filled correctly with the help from the clipboard', async () => {
    // Form page 1
    const institutionNameSelect = await getSelect(loader, '#institutionName');
    const firstnameInput = await getInput(loader, '#firstname');
    const lastnameInput = await getInput(loader, '#lastname');
    const phoneNoInput = await getInput(loader, '[id*="phoneNo"]');
    const emailInput = await getInput(loader, '[id*="email"]');
    const nextButton = await getButton(loader, '#btn-nav-action-next');

    await selectOption(institutionNameSelect, TEST_DATA.hospitalLocation.label);
    await firstnameInput.setValue('Homer');
    await lastnameInput.setValue('Simpson');
    await phoneNoInput.setValue('0800123456');
    await emailInput.setValue('homer@simpson.com');

    await nextButton.click();

    // Form page 2 - filled from clipboard
    // Parse the clipboard data as the PasteBox component would
    const clipboardString = 'B.adultsOccupied=47&B.childrenOccupied=11&B.adultsOperable=33&B.childrenOperable=5';
    const clipboardMap = new Map<string, string>();
    clipboardString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      clipboardMap.set(key, value);
    });

    // Call the service method directly to update the clipboard data
    const clipboardService = TestBed.inject(BedOccupancyClipboardDataService);
    clipboardService.updateBedOccupancy(clipboardMap);

    const submitButton = await getButton(loader, '#btn-send-notification');

    expect(await submitButton.isDisabled()).toBe(false);
  });
});
