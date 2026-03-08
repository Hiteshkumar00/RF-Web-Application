import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { MainDashboard } from './Components/main-dashboard/main-dashboard';
import { SharedModule } from '../../shared/shared-module';


@NgModule({
  declarations: [
    MainDashboard
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
