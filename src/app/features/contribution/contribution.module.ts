import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionRoutingModule } from './contribution-routing.module';
import { SharedModule } from '../../shared/shared-module';

import { AddContributionListComponent } from './components/add-contribution-list/add-contribution-list.component';
import { AddContributionFormDialogComponent } from './components/add-contribution-form-dialog/add-contribution-form-dialog.component';
import { RemoveContributionListComponent } from './components/remove-contribution-list/remove-contribution-list.component';
import { RemoveContributionFormDialogComponent } from './components/remove-contribution-form-dialog/remove-contribution-form-dialog.component';

@NgModule({
    declarations: [
        AddContributionListComponent,
        AddContributionFormDialogComponent,
        RemoveContributionListComponent,
        RemoveContributionFormDialogComponent
    ],
    imports: [
        CommonModule,
        ContributionRoutingModule,
        SharedModule
    ]
})
export class ContributionModule { }
