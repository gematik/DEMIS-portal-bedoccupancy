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

import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationWrapperComponent } from './validation-wrapper.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { FormlyConfig, FormlyFormBuilder, FormlyModule, FormlyValueChangeEvent } from '@ngx-formly/core';
import { Subject } from 'rxjs';

describe('ValidationWrapperComponent', () => {
  let component: ValidationWrapperComponent;
  let fixture: ComponentFixture<ValidationWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationWrapperComponent, FormlyModule.forRoot({ validationMessages: [{ name: 'required', message: 'Contact is required' }] })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.inject(FormlyFormBuilder);
    fixture = TestBed.createComponent(ValidationWrapperComponent);
    component = fixture.componentInstance;

    component.field = {
      id: 'contacts',
      formControl: new FormArray([]),
      options: {
        showError: TestBed.inject(FormlyConfig).extras.showError,
        fieldChanges: new Subject<FormlyValueChangeEvent>(),
      },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render an alert for a valid contact group', () => {
    expect(component.showError).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('should not render an alert for an untouched group error', () => {
    component.formControl.setErrors({ required: true });
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(component.showError).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('should render the message for a touched group error', async () => {
    component.formControl.setErrors({ required: true });
    component.formControl.markAsTouched();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(component.showError).toBe(true);
    expect(alert.id).toBe('contacts-error');
    expect(alert.textContent?.trim()).toBe('Contact is required');
  });

  it('should not render a group alert when only a child is invalid', () => {
    component.field.formControl = new FormArray([new FormControl('', Validators.required)]);
    component.formControl.markAllAsTouched();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(component.showError).toBe(true);
    expect(component.formControl.errors).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('should honor explicitly requested group error display', async () => {
    component.formControl.setErrors({ required: true });
    component.field.validation = { show: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Contact is required');
  });

  it('should remove the alert when the group error is resolved', () => {
    component.formControl.setErrors({ required: true });
    component.formControl.markAsTouched();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();

    component.formControl.setErrors(null);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
