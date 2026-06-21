import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessYearListComponent } from './components/business-year-list/business-year-list.component';
import { BusinessYearListResolver } from './resolvers/business-year-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: BusinessYearListComponent,
    resolve: { data: BusinessYearListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessYearRoutingModule { }
