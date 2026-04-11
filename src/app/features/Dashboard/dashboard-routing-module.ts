import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessMetricsComponent } from './components/business-metrics/business-metrics.component';
import { PaymentDashboardComponent } from './components/payment-dashboard/payment-dashboard.component';
import { PerformanceDashboardComponent } from './components/performance-dashboard/performance-dashboard.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: 'business',
        component: BusinessMetricsComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'payment',
        component: PaymentDashboardComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'performance',
        component: PerformanceDashboardComponent,
        canActivate: [adminGuard]
    },
    {
        path: '',
        redirectTo: 'business',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
