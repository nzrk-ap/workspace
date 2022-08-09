import { ChangeDetectionStrategy, Component, OnInit, Output } from '@angular/core';
import { LocalizationRequest } from 'src/app/models/localizationrequest';
import { XrmService } from '../../services/xrm.service';
import { LocalizationResponse } from '../../models/localizationresponse';
import { LocalizationItem } from 'src/app/models/localizationitem';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-localization-table',
  templateUrl: './localization-table.component.html',
  styleUrls: ['./localization-table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LocalizationTableComponent implements OnInit {
  constructor(
    private xrmService: XrmService) { }

  private ACTION_TRACKING_NAME: string = 'SendLocalizationRequest';

  public localization = new Array<LocalizationItem>();
  public rows: string[] = [];
  public languages: string[] = [];
  public defaultLanguage!: string;

  public isSaved: boolean = false;
  public isIncorrectResponse: boolean = false;
  public isError: boolean = false;
  public responseText!: string;

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    let entity = this.xrmService.getCurrentEntity();
    let requestData = new LocalizationRequest();
    requestData.EntityLogicalName = 'sb_goaltemplate';
    requestData.EntityId = '261b795e-765d-ec11-8f8f-000d3a2b8519';
    requestData.Method = 'GET';
    console.log(requestData);
    this.xrmService.callActionTracking(this.ACTION_TRACKING_NAME,
      requestData)
      .subscribe({
        next: (result) => {
          let responseObj = JSON.parse(result.Response);
          if (responseObj.Code == 1 && responseObj.Message) {
            let messageObj = JSON.parse(responseObj.Message);
            this.handleLocalizationResponse(messageObj);
          }
          else {
            this.handleIncorrectResponse(responseObj.Message);
          }
        }, error: (err) => { this.handleError(err) }
      });
  }

  onSubmit(formParam: NgForm) {
    let entity = this.xrmService.getCurrentEntity();
    let requestData = new LocalizationRequest();
    requestData.EntityLogicalName = 'sb_goaltemplate';
    requestData.EntityId = '261b795e-765d-ec11-8f8f-000d3a2b8519';
    requestData.Method = 'PUT';
    requestData.Data = JSON.stringify(this.collectData(formParam));
    console.log(requestData);
    this.xrmService.callActionTracking(this.ACTION_TRACKING_NAME, requestData)
      .subscribe({
        next: (result) => {
          console.log(result);
          let resultObj = JSON.parse(result.Response);
          if (resultObj.Code == 1) {
            this.isSaved = true;
            setTimeout(() => { this.isSaved = false; }, 5000);
          }
          else {
            this.handleIncorrectResponse(resultObj.Message);
          }
        }, error: (err) => { this.handleError(err) }
      });
  }

  getColumnLocalization(column: string, language: string): string {
    let result = this.localization.filter(
      (loc) => loc.language == language && loc.hasOwnProperty(column)
    );

    if (result) {
      let prop = Object.getOwnPropertyDescriptor(result[0], column);
      return (<string>prop?.value)?.trim() ?? '';
    } else return '';
  }

  public displayTable(): boolean {
    return this.rows.length != 0 && this.languages.length != 0;
  }

  private collectData(formParam: NgForm): any {
    let data: any = {};
    let cellKeys = Object.keys(formParam.value);
    cellKeys.forEach((key) => {
      let cellValue = formParam.value[key];
      if (cellValue) {
        let properties = (<string>key).split('_');
        let field = properties[0];
        let langCode = properties[1];
        if (!data.hasOwnProperty(langCode)) data[langCode] = {};
        data[langCode][field] = cellValue;
      }
    });
    return data;
  }

  private handleLocalizationResponse(result: LocalizationResponse) {
    this.defaultLanguage = result.defaultLanguage;
    this.languages = result.languages;
    this.rows = result.columns;
    for (let item of Object.keys(result.localization)) {
      this.localization.push({
        language: item, ...(<any>result.localization)[item],
      });
    }
    this.rows?.sort((current, next) => current.localeCompare(next));
  }

  private handleIncorrectResponse(message: any) {
    this.isIncorrectResponse = true;
    if (message) {
      this.responseText = JSON.parse(message);
    } else {
      this.responseText = `Has no data. Check azure function`;
    }
    setTimeout(() => {
      this.isIncorrectResponse = false;
      this.responseText = '';
    }, 5000);
  }

  private handleError(error: any) {
    console.error(`Application error is ${error}`);
    this.isError = true;
    setTimeout(() => this.isError = false, 5000);
  }
}
