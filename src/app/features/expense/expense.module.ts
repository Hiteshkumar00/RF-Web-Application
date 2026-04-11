import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseFormDialogComponent } from './components/expense-form-dialog/expense-form-dialog.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
    declarations: [
        ExpenseListComponent,
        ExpenseFormDialogComponent
    ],
    imports: [
        CommonModule,
        ExpenseRoutingModule,
        SharedModule
    ]
})
export class ExpenseModule { }
