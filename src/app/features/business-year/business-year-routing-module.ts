import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessYearListComponent } from './components/business-year-list/business-year-list.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessYearListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessYearRoutingModule { }
