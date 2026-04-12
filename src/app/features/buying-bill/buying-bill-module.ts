import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { BuyingBillRoutingModule } from './buying-bill-routing-module';
import { BuyingBillListComponent } from './components/buying-bill-list/buying-bill-list.component';
import { BuyingBillFormDialogComponent } from './components/buying-bill-form-dialog/buying-bill-form-dialog.component';

@NgModule({
    declarations: [
        BuyingBillListComponent,
        BuyingBillFormDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        BuyingBillRoutingModule
    ]
})
export class BuyingBillModule { }
