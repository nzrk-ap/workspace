import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LocalizationTableComponent } from './components/localization-table/localization-table.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FilterLanguagesPipe } from './pipes/filter-languages.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LocalizationTableComponent,
    FilterLanguagesPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
