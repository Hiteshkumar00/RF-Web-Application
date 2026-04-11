import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgencyRoutingModule } from './agency-routing-module';
import { AgencyListComponent } from './components/agency-list/agency-list.component';
import { AgencyFormDialogComponent } from './components/agency-form-dialog/agency-form-dialog.component';
import { AgencyAdvancedComponent } from './components/agency-advanced/agency-advanced.component';

import { SharedModule } from '../../shared/shared-module';

@NgModule({
    declarations: [
        AgencyListComponent,
        AgencyFormDialogComponent,
        AgencyAdvancedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AgencyRoutingModule,
        SharedModule
    ],
    providers: []
})
export class AgencyModule { }
