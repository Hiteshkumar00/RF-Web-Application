import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityListComponent } from './components/entity-list/entity-list.component';
import { EntityListResolver } from './resolvers/entity-list.resolver';

const routes: Routes = [
  { 
    path: '', 
    component: EntityListComponent,
    resolve: { data: EntityListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
