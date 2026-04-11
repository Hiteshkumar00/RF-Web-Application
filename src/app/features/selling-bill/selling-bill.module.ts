import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { SellingBillRoutingModule } from './selling-bill-routing.module';

import { SellingBillListComponent } from './components/selling-bill-list/selling-bill-list.component';
import { SellingBillFormDialogComponent } from './components/selling-bill-form-dialog/selling-bill-form-dialog.component';

@NgModule({
    declarations: [
        SellingBillListComponent,
        SellingBillFormDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        SellingBillRoutingModule
    ]
})
export class SellingBillModule { }
