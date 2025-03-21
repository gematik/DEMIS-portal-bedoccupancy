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



import { Component, Inject, OnInit, SecurityContext, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Notification, OkResponse } from 'src/api/notification';
import { NGXLogger } from 'ngx-logger';
import { ErrorResult, MessageType, SuccessResult } from '../../models/ui/message';
import { FhirNotificationService } from '../../services/fhir-notification.service';
import { FileService } from '../../services/file.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface SubmitNotificationDialogData {
  notification: Notification;
  fhirService: FhirNotificationService;
}

@Component({
  selector: 'app-submit-notification-dialog',
  templateUrl: './submit-notification-dialog.component.html',
  styleUrls: ['./submit-notification-dialog.component.scss'],
})
export class SubmitNotificationDialogComponent implements OnInit {
  @ViewChild('progress', { static: true }) progressTemplate?: TemplateRef<any>;
  @ViewChild('responseSuccess', { static: true })
  responseSuccessTemplate?: TemplateRef<any>;
  @ViewChild('responseFail', { static: true })
  responseFailTemplate?: TemplateRef<any>;

  notification!: Notification;
  activeTemplate?: TemplateRef<any>;
  result: SuccessResult | ErrorResult | null = null;
  pdfDownload?: SafeUrl;
  displayedColumns: string[] = ['field', 'message'];
  fileName?: string;

  constructor(
    protected fileService: FileService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: SubmitNotificationDialogData,
    private logger: NGXLogger,
    private router: Router
  ) {}

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
    this.result = {
      type: MessageType.ERROR,
      message: 'Es ist ein Fehler aufgetreten.',
      messageDetails: response?.message,
      locations: [],
      validationErrors: response?.validationErrors,
    } as ErrorResult;
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
