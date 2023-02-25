import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { SecondPageComponent } from './second-page/second-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FirstSubpageComponent } from './first-subpage/first-subpage.component';
import { FirstPageBaseComponent } from './first-page-base/first-page-base.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    SecondPageComponent,
    HomePageComponent,
    NotFoundPageComponent,
    ToolbarComponent,
    FirstSubpageComponent,
    FirstPageBaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
