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

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { HexhexbuttonComponent } from '../shared/components/hexhexbutton/hexhexbutton.component';
import { BedOccupancyPasteBoxComponent } from '../shared/components/paste-box/paste-box.component';
import { BedOccupancyComponent } from './bed-occupancy.component';
import { BedOccupancyConstants } from './common/bed-occupancy-constants';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { SideNavigationStepperComponent } from './components/side-navigation-stepper/side-navigation-stepper.component';
import { SideNavigationWrapperComponent } from './components/side-navigation-wrapper/side-navigation-wrapper.component';
import { BedOccupancyNotificationFormDefinitionService } from './services/bed-occupancy-notification-form-definition.service';
import { BedOccupancyClipboardDataService } from './services/clipboard/bed-occupancy-clipboard-data.service';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MaxHeightContentContainerComponent, PasteBoxComponent, SectionHeaderComponent, TiledContentComponent } from '@gematik/demis-portal-core-library';

@NgModule({
  declarations: [
    FormWrapperComponent,
    SideNavigationWrapperComponent,
    SideNavigationStepperComponent,
    BedOccupancyComponent,
    HexhexbuttonComponent,
    // TODO: Remove this component once FEATURE_FLAG_PORTAL_PASTEBOX will be removed
    BedOccupancyPasteBoxComponent,
  ],
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      types: [
        {
          name: BedOccupancyConstants.DEMIS_FORM_WRAPPER_TEMPLATE_KEYWORD,
          component: FormWrapperComponent,
        },
      ],
    }),
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    FormlySelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatStepperModule,
    RouterModule,
    MatIconModule,
    MatButton,
    PasteBoxComponent,
    MaxHeightContentContainerComponent,
    SectionHeaderComponent,
    TiledContentComponent,
  ],
  providers: [
    BedOccupancyClipboardDataService,
    BedOccupancyNotificationFormDefinitionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class BedOccupancyModule {}
