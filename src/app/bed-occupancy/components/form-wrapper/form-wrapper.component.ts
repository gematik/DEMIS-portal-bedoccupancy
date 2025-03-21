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



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
})
export class FormWrapperComponent extends FieldType implements OnInit {
  selectedIndex = 0;
  currentFragment = '';

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      this.currentFragment = fragment;
      this.handleFragmentChange();
    });
  }

  handleFragmentChange() {
    this.field.fieldGroup.forEach((field: FormlyFieldConfig, index) => {
      if (field.props.anchor === this.currentFragment) {
        this.selectedIndex = index;
      }
    });
  }

  nextStep() {
    if (this.selectedIndex !== this.field.fieldGroup.length) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every(f => this.isValid(f)) : true;
  }
}
