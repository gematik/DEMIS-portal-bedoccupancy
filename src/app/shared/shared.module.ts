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



import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { SafePipeModule } from 'safe-pipe';
import { ErrorMessageDialogComponent } from './dialogs/message-dialog/error-message-dialog.component';
import { SubmitNotificationDialogComponent } from './dialogs/submit-notification-dialog/submit-notification-dialog.component';
import { AutocompleteTypeComponent } from './formly/types/autocomplete/autocomplete-type.component';
import { RepeatComponent } from './formly/types/repeat/repeat.component';
import { AddressAutocompleteWrapperComponent } from './formly/wrappers/address-autocomplete-wrapper/address-autocomplete-wrapper.component';
import { ExpansionPanelWrapperComponent } from './formly/wrappers/expansion-panel-wrapper/expansion-panel.wrapper';
import { ValidationWrapperComponent } from './formly/wrappers/validation-wrapper/validation-wrapper.component';
import { NotificationFormValidationModule } from './notification-form-validation-module';
import { StringFormatPipe } from './pipes/string-format.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DemisPortalSharedModule } from '@gematik/demis-portal-core-library';
@NgModule({
  declarations: [
    ErrorMessageDialogComponent,
    SubmitNotificationDialogComponent,
    ExpansionPanelWrapperComponent,
    ValidationWrapperComponent,
    AddressAutocompleteWrapperComponent,
    AutocompleteTypeComponent,
    RepeatComponent,
    StringFormatPipe,
  ],
  imports: [
    CommonModule,
    NotificationFormValidationModule,
    FormlyModule.forRoot({
      types: [
        { name: 'repeat', component: RepeatComponent },
        {
          name: 'autocomplete',
          component: AutocompleteTypeComponent,
          wrappers: ['form-field'],
        },
      ],
      wrappers: [
        { name: 'validation', component: ValidationWrapperComponent },
        {
          name: 'address-autocomplete',
          component: AddressAutocompleteWrapperComponent,
        },
        { name: 'expansion-panel', component: ExpansionPanelWrapperComponent },
      ],
      validationMessages: [{ name: 'required', message: 'Diese Angabe wird benötigt' }],
    }),
    MatDialogModule,
    MatExpansionModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    FormlySelectModule,
    MatSidenavModule,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    SafePipeModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    DemisPortalSharedModule,
  ],
  exports: [],
  providers: [MatDialogModule],
})
export class SharedModule {}
