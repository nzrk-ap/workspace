import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Context {
  getClientUrl(): string;
}

interface Xrm {}

@Injectable({ providedIn: 'root' })
export class XrmService {
  constructor(private httpClient: HttpClient) {
    if (window.parent != null && (<any>window.parent)['Xrm'] != null) {
      var context = (<any>window.parent).Xrm.Page.context as Context;
      var xrm = (<any>window.parent).Xrm;
      if (context != null) {
        this.context = context;
        console.log('Context is ' + this.context);
      }

      if (xrm != null) {
        this.xrm = xrm;
        console.log('Xrm is ' + this.xrm);
      }
    }
  }

  context: Context | undefined;
  xrm: Xrm | undefined;

  private apiUrl = '/api/data/v9.2/';

  getClientUrl() {
    this.context?.getClientUrl();
  }

  getCurrentEntity(): { logicalName: string; id: string } {
    let xrm = <any>this.xrm;
    let id = xrm.Page.data.entity.getId().replace(/[{}]/g, '');
    let entityName = xrm.Page.data.entity.getEntityName();
    return { logicalName: entityName, id: id };
  }

  callActionTracking(actionName: string, data: any): Observable<any> {
    let observable = new Observable((observer) => {
      let request = {
        ActionName: actionName,
        Parameters: JSON.stringify(data),

        getMetadata: function () {
          return {
            boundParameter: null,
            parameterTypes: {
              ActionName: {
                typeName: 'Edm.String',
                structuralProperty: 1,
              },
              Parameters: {
                typeName: 'Edm.String',
                structuralProperty: 1,
              },
            },
            operationType: 0,
            operationName: 'sb_ActionTracking',
          };
        },
      };

      (<any>this.xrm).WebApi.online
        .execute(request)
        .then(function success(result: any) {
          if (result.ok) {
            console.log('Success');
            result.json().then((response: any) => {
              observer.next(response);
            });
          }
        })
        .catch(function (error: any) {
          console.log(error.message);
          observer.error(error.message);
        });
    });

    return observable;
  }
}
