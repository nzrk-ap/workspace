import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Context {
  getClientUrl(): string;
}

interface Xrm { }

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

    // Parameters
    var parameters = {
      ActionName: actionName,
      Parameters: JSON.stringify(data)
    };

    return new Observable((observer) => {
      let globalContext = (<any>this.xrm).Utility.getGlobalContext();
      let apiVersion = globalContext.getVersion().substring(0, 3);
      fetch(globalContext.getClientUrl() + `/api/data/v${apiVersion}/sb_ActionTracking`, {
        method: "POST",
        headers: {
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify(parameters)
      }).then(
        async function success(response) {
          const json = await response.json();
          if (response.ok) { return [response, json]; } else { throw json.error; }
        }
      ).then(function (responseObjects) {
        var responseBody = responseObjects[1];
        console.log(responseBody);
        observer.next(responseBody);
      }).catch(function (error) {
        throw error;
      });
    });
  }
}
