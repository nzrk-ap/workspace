import { Component, OnInit } from '@angular/core';
import { LocalizationRequest } from 'src/app/models/localizationrequest';
import { XrmService } from '../../services/xrm.service';
import { HttpService } from '../../services/http.service';
import { LocalizationResponse } from '../../models/localizationresponse';
import { LocalizationItem } from 'src/app/models/localizationitem';

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
    // console.log('Click');
    // let currentEntity = this.xrmService.getCurrentEntity();
    // console.log(`${currentEntity.logicalName}:${currentEntity.id}`);
    // let params = {
    //   EntityLogicalName: 'sb_goaltemplate',
    //   EntityId: 'bef97d11-94eb-eb11-bacb-000d3a474263',
    // };
    // var request = {
    //   EntityLogicalName: 'sb_goaltemplate',
    //   EntityId: 'bef97d11-94eb-eb11-bacb-000d3a474263',
    //   Method: 'GET'
    // };
    // this.xrmService
    //   .callActionTracking(this.ACTION_TRACKING_NAME, request)
    //   .subscribe((result) => {
    //     console.log(result);
    //     var response = JSON.parse(result.Response);
    //     console.log(response);
    //   });

    // this.xrmService.callRequest().subscribe((result) => {
    //   debugger;
    //   console.log(result);
    // });
    debugger;
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
      return <string>prop?.value;
    } else return '';
  }

  addField() {
    this.addFieldVisible = true;
  }

  public rows: string[] = [];

  public localization = new Array<LocalizationItem>();

  public fieldsToAdd: string[] = ['Amount', 'Period', 'Address'];

  public addFieldVisible: boolean = false;
}
