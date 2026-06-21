import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemConfigurationListComponent } from './components/system-configuration-list/system-configuration-list.component';
import { SystemConfigurationListResolver } from './resolvers/system-configuration-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: SystemConfigurationListComponent,
    resolve: { data: SystemConfigurationListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemConfigurationRoutingModule { }
