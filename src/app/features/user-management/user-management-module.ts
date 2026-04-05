import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing-module';
import { UserListComponent } from './Components/user-list/user-list.component';
import { UserFormDialogComponent } from './Components/user-form-dialog/user-form-dialog.component';
import { UserViewDialogComponent } from './Components/user-view-dialog/user-view-dialog.component';

import { SharedModule } from '../../shared/shared-module';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';

@NgModule({
    declarations: [
        UserListComponent,
        UserFormDialogComponent,
        UserViewDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UserManagementRoutingModule,
        SharedModule,
        CheckboxModule,
        TagModule
    ],
    providers: []
})
export class UserManagementModule { }
