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



import { Component, Inject, OnInit } from '@angular/core';
import { DialogNotificationData, ErrorResult, MessageType } from '../../models/ui/message';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './error-message-dialog.component.html',
  styleUrls: ['./error-message-dialog.component.scss'],
})
export class ErrorMessageDialogComponent implements OnInit {
  displayedColumns: string[] = ['field', 'message'];

  constructor(@Inject(MAT_DIALOG_DATA) public error: ErrorResult) {}

  ngOnInit(): void {}

  isError(messageType: MessageType) {
    return messageType === MessageType.ERROR;
  }

  static getErrorDialogCommonData(error, title) {
    return {
      maxWidth: '50vw',
      minHeight: '40vh',
      panelClass: 'app-submit-notification-dialog-panel',
      data: {
        type: MessageType.ERROR,
        title: title,
        message: 'Es ist ein Fehler aufgetreten',
        messageDetails: error.error ? error?.error?.message : error.message,
        statusCode: error.error ? error?.error?.statusCode : null,
        validationErrors: error.error ? error.error?.validationErrors : null,
        actions: [{ value: 'home', label: 'Zurück zur Hauptseite' }],
      } as DialogNotificationData,
    };
  }

  static getErrorDialogClose(details: { title: string; message: string; messageDetails?: string; type: MessageType; error? }) {
    return {
      maxWidth: '50vw',
      minHeight: '40vh',
      panelClass: 'app-close-notification-dialog-panel',
      data: {
        type: details.type,
        title: details.title,
        message: details.message,
        messageDetails: details.messageDetails ? details.messageDetails : details.error?.error ? details.error?.error?.message : details.error?.message,
        statusCode: details.error?.error ? details.error?.error?.statusCode : null,
        validationErrors: details.error?.error ? details.error.error?.validationErrors : null,
        actions: [{ value: 'close', label: 'Schließen' }],
      } as DialogNotificationData,
    };
  }
}
