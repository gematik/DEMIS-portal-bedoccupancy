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

import { Injectable } from '@angular/core';
import { BedOccupancyQuestion } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, take } from 'rxjs';
import { ClipboardDataService } from './clipboard-data.service';
import { BedOccupancyQuestionClipboard } from './clipboard-enums';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class BedOccupancyClipboardDataService extends ClipboardDataService {
  private clipboardData = new BehaviorSubject<any>(null);
  constructor(
    public override dialog: MatDialog,
    public override logger: NGXLogger
  ) {
    super(dialog, logger);
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
