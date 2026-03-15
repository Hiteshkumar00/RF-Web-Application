import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountManagementRoutingModule } from './account-management-routing-module';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountFormDialogComponent } from './components/account-form-dialog/account-form-dialog.component';
import { AccountViewDialogComponent } from './components/account-view-dialog/account-view-dialog.component';

import { SharedModule } from '../../shared/shared-module';

@NgModule({
    declarations: [
        AccountListComponent,
        AccountFormDialogComponent,
        AccountViewDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AccountManagementRoutingModule,
        SharedModule
    ],
    providers: []
})
export class AccountManagementModule { }
