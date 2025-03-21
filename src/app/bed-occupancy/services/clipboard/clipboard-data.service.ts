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

import { MessageType } from 'src/app/shared/models/ui/message';
import { merge } from 'lodash-es';
import { NGXLogger } from 'ngx-logger';

import { ErrorMessageDialogComponent } from 'src/app/shared/dialogs/message-dialog/error-message-dialog.component';
import { matchesRegExp } from 'src/app/shared/notification-form-validation-module';
import { ClipboardErrorTexts } from './clipboard-enums';
import { MatDialog } from '@angular/material/dialog';
import { catchError, from, Observable, of, take } from 'rxjs';
import { map } from 'rxjs/operators';

export type ClipboardRules = Record<string, (key: string, partialModel: any) => any | Promise<any>>;

@Injectable({
  providedIn: 'root',
})
export abstract class ClipboardDataService {
  protected constructor(
    public dialog: MatDialog,
    protected logger: NGXLogger
  ) {}

  // getClipboardKVs(): Observable<string[][]>{
  //   return from(window.navigator.clipboard.readText()).pipe(
  //     take(1),
  //     map(clipboard => {
  //       if (!matchesRegExp(/^URL .*/, clipboard)) {
  //         throw 'invalid clipboard: it does not start with "URL "';
  //       }
  //       const urlParams = clipboard.substring(4);
  //       const kvs: string[][] = decodeURI(urlParams)
  //         .split('&')
  //         .map((s) => s.split('=').map((s) => s.trim()));
  //       if (kvs.length === 0) {
  //         throw 'empty parameter list';
  //       }
  //       return kvs;
  //   }));
  // }

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

  openErrorDialog(): void {
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

  private getStringAfterChar = (fullString: string, char: string) => {
    return fullString.substring(fullString.indexOf(char) + 1);
  };

  private getStringBeforeChar = (fullString: string, char: string) => {
    return fullString.substring(0, fullString.indexOf(char));
  };

  //   async fillModelFromClipBoard(model: any, rules: ClipboardRules) {
  //     const keyValuePairs = await this.getClipboardKVs();
  //     const problems: string[] = await this.fillModel(
  //       model,
  //       rules,
  //       keyValuePairs
  //     );
  //     if (problems.length > 0)
  //       this.logger.error('Fehlerhafte Datem vom KIS:', ...problems);
  //     window.navigator.clipboard.writeText('');
  //   }
  //
  //   async fillModel(
  //     model: any,
  //     rules: ClipboardRules,
  //     keyValuePairs: string[][]
  //   ): Promise<string[]> {
  //     const problems: string[] = [];
  //     for (let [key, value] of keyValuePairs) {
  //       if (value === '') {
  //         continue;
  //       }
  //       if (value === undefined) {
  //         problems.push(`PT_4713 Falsche Syntax nahe: ${key}`);
  //         continue;
  //       }
  //       const rule = rules[key];
  //       if (!rule) {
  //         problems.push(`PT_4714 Ungültiger Parametername: ${key}`);
  //         continue;
  //       }
  //       const promiseOrStruct = rule(value, model);
  //
  //       if (isPromise(promiseOrStruct)) {
  //         const struct = await promiseOrStruct;
  //         merge(model, struct);
  //       } else {
  //         merge(model, promiseOrStruct);
  //       }
  //     }
  //     return problems;
  //   }
}

export function isPromise(val: any | Promise<any>): val is Promise<any> {
  return val && (<Promise<any>>val).then !== undefined;
}
