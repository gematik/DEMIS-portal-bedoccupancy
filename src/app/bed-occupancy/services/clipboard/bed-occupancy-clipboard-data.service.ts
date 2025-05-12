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
import { BedOccupancyQuestion } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, take } from 'rxjs';
import { ClipboardDataService } from './clipboard-data.service';
import { BedOccupancyQuestionClipboard } from './clipboard-enums';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogService } from '@gematik/demis-portal-core-library';

@Injectable({
  providedIn: 'root',
})
export class BedOccupancyClipboardDataService extends ClipboardDataService {
  private clipboardData = new BehaviorSubject<any>(null);
  constructor(
    public override dialog: MatDialog,
    public override logger: NGXLogger,
    protected override messageDialogeService: MessageDialogService
  ) {
    super(dialog, logger, messageDialogeService);
  }

  clipboardData$ = this.clipboardData.asObservable();

  fillBedOccupancyWithClipBoardData() {
    this.validateClipBoardData()
      .pipe(take(1))
      .subscribe(validatedMap => {
        if (validatedMap instanceof Map) {
          this.updateBedOccupancy(validatedMap);
        }
      });
  }

  private updateBedOccupancy(clipboardMap: Map<string, string>): void {
    const bedquestion = this.setBedOccupancyQuestionFromClipBoard(clipboardMap);
    this.clipboardData.next({
      bedOccupancyQuestion: bedquestion,
    });
  }

  setBedOccupancyQuestionFromClipBoard(paramMap: Map<string, string>): BedOccupancyQuestion {
    return {
      occupiedBeds: {
        adultsNumberOfBeds: this.setNumberValue(+paramMap.get(BedOccupancyQuestionClipboard.ADULTS_OCCUPIED)),
        childrenNumberOfBeds: this.setNumberValue(+paramMap.get(BedOccupancyQuestionClipboard.CHILDREN_OCCUPIED)),
      },
      operableBeds: {
        adultsNumberOfBeds: this.setNumberValue(+paramMap.get(BedOccupancyQuestionClipboard.ADULTS_OPERABLE)),
        childrenNumberOfBeds: this.setNumberValue(+paramMap.get(BedOccupancyQuestionClipboard.CHILDREN_OPERABLE)),
      },
    };
  }

  setNumberValue = (value: number): number => {
    return value ? value : undefined;
  };
}
