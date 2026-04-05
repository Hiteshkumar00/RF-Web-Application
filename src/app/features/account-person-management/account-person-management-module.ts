import { NgModule } from '@angular/core';
import { AccountPersonManagementRoutingModule } from './account-person-management-routing.module';
import { AccountPersonListComponent } from './Components/account-person-list/account-person-list.component';
import { AccountPersonFormDialogComponent } from './Components/account-person-form-dialog/account-person-form-dialog.component';
import { AccountPersonViewDialogComponent } from './Components/account-person-view-dialog/account-person-view-dialog.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
    declarations: [
        AccountPersonListComponent,
        AccountPersonFormDialogComponent,
        AccountPersonViewDialogComponent
    ],
    imports: [
        AccountPersonManagementRoutingModule,
        SharedModule
    ]
})
export class AccountPersonManagementModule { }
