import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoefficientChartComponent } from './Components/coefficient-chart/coefficient-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CoefficientChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
