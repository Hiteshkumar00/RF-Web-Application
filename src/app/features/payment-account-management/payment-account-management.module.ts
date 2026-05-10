import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { PaymentAccountManagementRoutingModule } from './payment-account-management-routing.module';
import { PaymentAccountListComponent } from './Components/payment-account-list/payment-account-list.component';
import { PaymentAccountFormDialogComponent } from './Components/payment-account-form-dialog/payment-account-form-dialog.component';
import { PaymentAccountViewDialogComponent } from './Components/payment-account-view-dialog/payment-account-view-dialog.component';
import { PaymentHistoryListComponent } from './Components/payment-history-list/payment-history-list.component';
import { PaymentTransferListComponent } from './Components/payment-transfer-list/payment-transfer-list.component';
import { PaymentTransferFormDialogComponent } from './Components/payment-transfer-form-dialog/payment-transfer-form-dialog.component';

@NgModule({
    declarations: [
        PaymentAccountListComponent,
        PaymentAccountFormDialogComponent,
        PaymentAccountViewDialogComponent,
        PaymentHistoryListComponent,
        PaymentTransferListComponent,
        PaymentTransferFormDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        PaymentAccountManagementRoutingModule
    ]
})
export class PaymentAccountManagementModule { }
