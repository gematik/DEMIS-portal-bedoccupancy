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

import { Injectable, inject } from '@angular/core';

import { MessageType } from 'src/app/shared/models/ui/message';
import { NGXLogger } from 'ngx-logger';

import { ErrorMessageDialogComponent } from 'src/app/shared/dialogs/message-dialog/error-message-dialog.component';
import { matchesRegExp } from 'src/app/shared/notification-form-validation-module';
import { ClipboardErrorTexts } from './clipboard-enums';
import { MatDialog } from '@angular/material/dialog';
import { catchError, from, Observable, of, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MessageDialogService } from '@gematik/demis-portal-core-library';

export type ClipboardRules = Record<string, (key: string, partialModel: any) => any | Promise<any>>;

/**
 * @deprecated Not needed anymore, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
 */
@Injectable({
  providedIn: 'root',
})
export abstract class ClipboardDataService {
  dialog = inject(MatDialog);
  protected logger = inject(NGXLogger);
  protected messageDialogeService = inject(MessageDialogService);

  /**
   * @deprecated Not needed anymore, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
   *
   * @returns
   */
  validateClipBoardData(): Observable<Map<string, string>> {
    return from(window.navigator.clipboard.readText()).pipe(
      take(1),
      catchError((reason, caught) => {
        this.openErrorDialog();
        this.logger.error(ClipboardErrorTexts.CLIPBOARD_ERROR + reason);
        return of(null);
      }),
      map(data => {
        if (data) {
          const clipboardMap = this.convertClipBoardDataToMap(data);
          if (clipboardMap.size != 0) {
            window.navigator.clipboard.writeText('');
            return clipboardMap;
          }
        } else {
          return new Map<string, string>();
        }
        this.openErrorDialog();
      })
    );
  }

  /**
   * @deprecated Not needed anymore, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
   *
   * @param data
   * @returns
   */
  convertClipBoardDataToMap(data: string): Map<string, string> {
    data = decodeURI(data).trim();
    let clipBoardMap = new Map<string, string>();
    const regexp = /^URL .*/;
    if (matchesRegExp(regexp, data)) {
      data = this.getStringAfterChar(data, ' ');
      const keyValuePairs = data.split('&');
      keyValuePairs.forEach(kv => {
        const value = this.getStringAfterChar(kv, '=');
        if (value) {
          clipBoardMap.set(this.getStringBeforeChar(kv, '='), value);
        }
      });
    }
    return clipBoardMap;
  }

  /**
   * @deprecated Not needed anymore, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
   *
   * @returns
   */
  openErrorDialog(): void {
    if (environment.bedOccupancyConfig.featureFlags?.FEATURE_FLAG_PORTAL_ERROR_DIALOG) {
      this.messageDialogeService.showErrorDialogInsertDataFromClipboard();
    } else {
      this.dialog.open(
        ErrorMessageDialogComponent,
        ErrorMessageDialogComponent.getErrorDialogClose({
          title: ClipboardErrorTexts.CLIPBOARD_ERROR_DIALOG_TITLE,
          message: ClipboardErrorTexts.CLIPBOARD_ERROR_DIALOG_MESSAGE,
          messageDetails: ClipboardErrorTexts.CLIPBOARD_ERROR_DIALOG_MESSAGE_DETAILS,
          type: MessageType.WARNING,
        })
      );
    }
  }

  /**
   * @deprecated Not needed anymore, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
   *
   * @returns
   */
  private getStringAfterChar = (fullString: string, char: string) => {
    return fullString.substring(fullString.indexOf(char) + 1);
  };

  /**
   * @deprecated Not needed anymore, once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
   *
   * @returns
   */
  private getStringBeforeChar = (fullString: string, char: string) => {
    return fullString.substring(0, fullString.indexOf(char));
  };
}
