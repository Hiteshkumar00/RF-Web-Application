import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntityRoutingModule } from './entity-routing-module';
import { EntityListComponent } from './components/entity-list/entity-list.component';
import { EntityFormDialogComponent } from './components/entity-form-dialog/entity-form-dialog.component';
import { EntityViewDialogComponent } from './components/entity-view-dialog/entity-view-dialog.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    EntityListComponent,
    EntityFormDialogComponent,
    EntityViewDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EntityRoutingModule,
    SharedModule
  ]
})
export class EntityModule { }
