import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgencyRoutingModule } from './agency-routing-module';
import { AgencyListComponent } from './components/agency-list/agency-list.component';
import { AgencyFormDialogComponent } from './components/agency-form-dialog/agency-form-dialog.component';
import { AgencyAdvancedComponent } from './components/agency-advanced/agency-advanced.component';
import { AgencyPersonListComponent } from './components/agency-person-list/agency-person-list.component';
import { AgencyPersonFormDialogComponent } from './components/agency-person-form-dialog/agency-person-form-dialog.component';
import { AgencyPaymentListComponent } from './components/agency-payment-list/agency-payment-list.component';
import { AgencyPaymentFormDialogComponent } from './components/agency-payment-form-dialog/agency-payment-form-dialog.component';
import { BuyingBillModule } from '../buying-bill/buying-bill-module';

import { SharedModule } from '../../shared/shared-module';

import { AgencyAdvancedDetailDialogComponent } from './components/agency-advanced-detail-dialog/agency-advanced-detail-dialog.component';

@NgModule({
    declarations: [
        AgencyListComponent,
        AgencyFormDialogComponent,
        AgencyAdvancedComponent,
        AgencyPersonListComponent,
        AgencyPersonFormDialogComponent,
        AgencyPaymentListComponent,
        AgencyPaymentFormDialogComponent,
        AgencyAdvancedDetailDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AgencyRoutingModule,
        SharedModule,
        BuyingBillModule
    ],
    providers: []
})
export class AgencyModule { }
