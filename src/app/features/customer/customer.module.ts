import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared-module';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormDialogComponent } from './components/customer-form-dialog/customer-form-dialog.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerFormDialogComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
