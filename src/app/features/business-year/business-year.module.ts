import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BusinessYearRoutingModule } from './business-year-routing-module';
import { BusinessYearListComponent } from './components/business-year-list/business-year-list.component';
import { BusinessYearFormDialogComponent } from './components/business-year-form-dialog/business-year-form-dialog.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    BusinessYearListComponent,
    BusinessYearFormDialogComponent
  ],
  imports: [
    BusinessYearRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BusinessYearModule { }
