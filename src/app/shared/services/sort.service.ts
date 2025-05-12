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

import { Injectable } from '@angular/core';

@Injectable()
export class SortService {
  public sortObjects(objects: Array<any>, asc: boolean, prop: string): any {
    const propList = prop.split(/\./);
    if (objects) {
      objects = objects.sort((a: any, b: any): number => {
        let aProp: any;
        let bProp: any;
        if (propList.length === 1) {
          aProp = a[prop];
          bProp = b[prop];
        }
        if (propList.length === 2) {
          const prop0 = propList[0];
          const prop1 = propList[1];
          aProp = a[prop0][prop1];
          bProp = b[prop0][prop1];
        }
        if (propList.length === 3) {
          const prop0 = propList[0];
          const prop1 = propList[1];
          const prop2 = propList[2];

          aProp = a[prop0][prop1][prop2];
          bProp = b[prop0][prop1][prop2];
        }
        if (propList.length === 4) {
          const prop0 = propList[0];
          const prop1 = propList[1];
          const prop2 = propList[2];
          const prop3 = propList[3];

          aProp = a[prop0][prop1][prop2][prop3];
          bProp = b[prop0][prop1][prop2][prop3];
        }
        if (typeof aProp === 'string') {
          aProp = aProp.toLowerCase();
        }
        if (typeof bProp === 'string') {
          bProp = bProp.toLowerCase();
        }
        if (asc) {
          if (aProp < bProp || aProp === null) {
            return -1;
          }
          if (aProp > bProp || bProp === null) {
            return 1;
          }
          return 0;
        } else {
          if (aProp > bProp || bProp === null) {
            return -1;
          }
          if (aProp < bProp || aProp === null) {
            return 1;
          }
          return 0;
        }
      });
    }
    return objects;
  }
}
