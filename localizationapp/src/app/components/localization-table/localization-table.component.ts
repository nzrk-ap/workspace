import { Component, OnInit, Output } from '@angular/core';
import { LocalizationRequest } from 'src/app/models/localizationrequest';
import { XrmService } from '../../services/xrm.service';
import { HttpService } from '../../services/http.service';
import { LocalizationResponse } from '../../models/localizationresponse';
import { LocalizationItem } from 'src/app/models/localizationitem';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-localization-table',
  templateUrl: './localization-table.component.html',
  styleUrls: ['./localization-table.component.css'],
})
export class LocalizationTableComponent implements OnInit {
  constructor(
    private xrmService: XrmService,
    private HttpService: HttpService
  ) {}

  private ACTION_TRACKING_NAME: string = 'SendLocalizationRequest';
  public defaultLanguage!: string;
  public languages: string[] = [];

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    this.HttpService.getLocalization().subscribe(
      (result: LocalizationResponse) => {
        this.rows = result.columns;
        this.languages = result.languages;
        this.defaultLanguage = result.defaultLanguage;
        for (let item of Object.keys(result.localization)) {
          this.localization.push({
            language: item,
            ...(<any>result.localization)[item],
          });
        }
        this.sortRows();
      }
    );
  }

  sortRows() {
    this.rows?.sort((current, next) => current.localeCompare(next));
  }

  getColumnLocalization(column: string, language: string): string {
    let result = this.localization.filter(
      (i) => i.language == language && i.hasOwnProperty(column)
    );

    if (result) {
      let prop = Object.getOwnPropertyDescriptor(result[0], column);
      return (<string>prop?.value)?.trim() ?? '';
    } else return '';
  }

  onSubmit(formParam: NgForm) {
    debugger;
    console.log(formParam);
    let data = this.collectData(formParam);
    this.HttpService.save(data).subscribe((result) => console.log(result));
  }

  collectData(formParam: NgForm): any {
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

  public rows: string[] = [];
  public localization = new Array<LocalizationItem>();
}
