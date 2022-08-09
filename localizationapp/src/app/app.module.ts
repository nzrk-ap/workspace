import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LocalizationTableComponent } from './components/localization-table/localization-table.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterLanguagesPipe } from './pipes/filter-languages.pipe';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    LocalizationTableComponent,
    FilterLanguagesPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
