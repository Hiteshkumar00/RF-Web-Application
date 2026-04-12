import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { AccountProfileRoutingModule } from './account-profile-routing.module';
import { AccountProfileComponent } from './components/account-profile/account-profile.component';
import { AccountManagementModule } from '../account-management/account-management-module';

@NgModule({
  declarations: [
    AccountProfileComponent
  ],
  imports: [
    CommonModule,
    AccountProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccountManagementModule
  ]
})
export class AccountProfileModule { }
