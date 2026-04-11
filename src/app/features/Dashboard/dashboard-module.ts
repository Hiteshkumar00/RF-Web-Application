import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { BusinessMetricsComponent } from './components/business-metrics/business-metrics.component';
import { PaymentDashboardComponent } from './components/payment-dashboard/payment-dashboard.component';
import { PerformanceDashboardComponent } from './components/performance-dashboard/performance-dashboard.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    BusinessMetricsComponent,
    PaymentDashboardComponent,
    PerformanceDashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
