import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { BuyingBillRoutingModule } from './buying-bill-routing-module';
import { BuyingBillListComponent } from './components/buying-bill-list/buying-bill-list.component';
import { BuyingBillFormDialogComponent } from './components/buying-bill-form-dialog/buying-bill-form-dialog.component';
import { BuyingBillPaymentDialogComponent } from './components/buying-bill-payment-dialog/buying-bill-payment-dialog.component';

@NgModule({
    declarations: [
        BuyingBillListComponent,
        BuyingBillFormDialogComponent,
        BuyingBillPaymentDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        BuyingBillRoutingModule
    ],
    exports: [
        BuyingBillPaymentDialogComponent
    ]
})
export class BuyingBillModule { }
