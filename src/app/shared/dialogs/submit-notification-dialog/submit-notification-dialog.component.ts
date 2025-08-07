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

import { Component, OnInit, SecurityContext, TemplateRef, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BedOccupancy, OkResponse } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { ErrorResult, MessageType, SuccessResult } from '../../models/ui/message';
import { FhirNotificationService } from '../../services/fhir-notification.service';
import { FileService } from '../../services/file.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MessageDialogService } from '@gematik/demis-portal-core-library';

export interface SubmitNotificationDialogData {
  notification: BedOccupancy;
  fhirService: FhirNotificationService;
}

@Component({
  selector: 'app-submit-notification-dialog',
  templateUrl: './submit-notification-dialog.component.html',
  styleUrls: ['./submit-notification-dialog.component.scss'],
  standalone: false,
})
export class SubmitNotificationDialogComponent implements OnInit {
  protected fileService = inject(FileService);
  private readonly sanitizer = inject(DomSanitizer);
  data = inject<SubmitNotificationDialogData>(MAT_DIALOG_DATA);
  private readonly logger = inject(NGXLogger);
  private readonly router = inject(Router);

  @ViewChild('progress', { static: true }) progressTemplate?: TemplateRef<any>;
  @ViewChild('responseSuccess', { static: true })
  responseSuccessTemplate?: TemplateRef<any>;
  @ViewChild('responseFail', { static: true })
  responseFailTemplate?: TemplateRef<any>;

  notification!: BedOccupancy;
  activeTemplate?: TemplateRef<any>;
  result: SuccessResult | ErrorResult | null = null;
  pdfDownload?: SafeUrl;
  displayedColumns: string[] = ['field', 'message'];
  fileName?: string;
  dialogRef = inject(MatDialogRef<SubmitNotificationDialogComponent>);
  messageDialogService = inject(MessageDialogService);

  ngOnInit() {
    this.notification = { ...this.data.notification };
    this.submitNotification();
  }

  submitNotification() {
    this.activeTemplate = this.progressTemplate;
    this.data.fhirService.sendNotification(this.notification).subscribe(
      response => {
        const content = encodeURIComponent(response.body.content);
        const href = 'data:application/actet-stream;base64,' + content;
        this.pdfDownload = this.sanitizer.bypassSecurityTrustUrl(href);
        if (response.body.status === 'All OK') {
          this.fileName = this.fileService.getFileNameByNotificationType(this.notification);
          this.triggerDownload(href);
          this.buildSuccessResult(response.body);
          this.activeTemplate = this.responseSuccessTemplate;
        } else {
          this.setResultToError(response);
          this.activeTemplate = this.responseFailTemplate;
        }
      },
      error => {
        this.logger.error('error', error);
        this.setResultToError(error.error);
        this.activeTemplate = this.responseFailTemplate;
      },
      () => {
        this.logger.log('complete');
      }
    );
  }

  private buildSuccessResult(response: OkResponse) {
    this.result = {
      type: MessageType.SUCCESS,
      status: response.status,
      timestamp: response.timestamp,
      authorName: response.authorName,
      authorEmail: response.authorEmail,
      receiptContentType: response.contentType,
      receiptContent: response.content,
      message: response.title,
      notificationId: response.notificationId,
    } as SuccessResult;
  }

  private setResultToError(response: any) {
    if (environment.bedOccupancyConfig.featureFlags?.FEATURE_FLAG_PORTAL_ERROR_DIALOG_ON_SUBMIT) {
      const errorMessage = this.messageDialogService.extractMessageFromError(response);
      this.dialogRef.close(); //closes the underlying dialog "Meldung wird gesendet"
      this.messageDialogService.showErrorDialog({
        errorTitle: 'Meldung konnte nicht zugestellt werden!',
        errors: [
          {
            text: errorMessage,
            queryString: errorMessage || '',
          },
        ],
      });
    } else {
      this.result = {
        type: MessageType.ERROR,
        message: 'Es ist ein Fehler aufgetreten.',
        messageDetails: response?.message,
        locations: [],
        validationErrors: response?.validationErrors,
      } as ErrorResult;
    }
  }

  private triggerDownload(url: string) {
    const downloadLink = document.createElement('a');
    const href: string | null = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(url));
    if (href && this.fileName) {
      downloadLink.href = href;
      downloadLink.download = this.fileName;
      downloadLink.click();
    } else {
      // TODO how to signal error?
    }
  }

  navigateToWelcomePage() {
    this.router.navigate(['']).then(() => this.router.navigate(['/welcome']));
  }
}
