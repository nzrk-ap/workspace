import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { LocalizationResponse } from '../models/localizationresponse';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private httpClient: HttpClient) { }

  getLocalization(): Observable<LocalizationResponse> {
    return this.httpClient
      .get(
        'https://func-hcmlms-sync-dev.azurewebsites.net/api/localization/sb_goaltemplate/BEF97D11-94EB-EB11-BACB-000D3A474263?code=31Qv6Tg7g0slsMvQBadpRQSdDckMZripcxxlSfVsbbefTv2mGYInZg=='
      )
      .pipe(map((result) => <LocalizationResponse>result));
  }

  save(data: string) {
    let input = JSON.stringify(data);
    console.log();
    return this.httpClient.put(
      'https://func-hcmlms-sync-dev.azurewebsites.net/api/localization/sb_goaltemplate/BEF97D11-94EB-EB11-BACB-000D3A474263?code=31Qv6Tg7g0slsMvQBadpRQSdDckMZripcxxlSfVsbbefTv2mGYInZg==',
      input,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }
}
