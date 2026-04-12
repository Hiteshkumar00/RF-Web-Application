import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountProfileComponent } from './components/account-profile/account-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileComponent
  },
  {
    path: ':id',
    component: AccountProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountProfileRoutingModule { }
