import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerListResolver } from './resolvers/customer-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    resolve: { data: CustomerListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
