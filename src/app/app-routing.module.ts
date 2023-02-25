import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstPageBaseComponent } from './first-page-base/first-page-base.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { FirstSubpageComponent } from './first-subpage/first-subpage.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SecondPageComponent } from './second-page/second-page.component'; 

const routes: Routes = [
  { path: 'first',
    component: FirstPageBaseComponent,
    children: [
      { path: '', component: FirstPageComponent},
      { path: 'subpage', component: FirstSubpageComponent}
    ]
  },
  { path: 'second', component: SecondPageComponent },
  { path: '', component: HomePageComponent },
  { path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
