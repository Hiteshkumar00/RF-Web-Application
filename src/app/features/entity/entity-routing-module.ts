import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityListComponent } from './components/entity-list/entity-list.component';

const routes: Routes = [
  { path: '', component: EntityListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
