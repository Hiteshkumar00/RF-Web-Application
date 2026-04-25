import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemConfigurationListComponent } from './components/system-configuration-list/system-configuration-list.component';

const routes: Routes = [
  {
    path: '',
    component: SystemConfigurationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemConfigurationRoutingModule { }
