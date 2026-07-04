import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyListComponent } from './components/agency-list/agency-list.component';
import { AgencyAdvancedComponent } from './components/agency-advanced/agency-advanced.component';
import { AgencyPersonListComponent } from './components/agency-person-list/agency-person-list.component';
import { AgencyPaymentListComponent } from './components/agency-payment-list/agency-payment-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { AgencyListResolver } from './resolvers/agency-list.resolver';
import { AgencyPersonListResolver } from './resolvers/agency-person-list.resolver';
import { AgencyPaymentListResolver } from './resolvers/agency-payment-list.resolver';

const routes: Routes = [
    {
        path: 'manage',
        component: AgencyListComponent,
        canActivate: [adminGuard],
        resolve: { data: AgencyListResolver }
    },
    {
        path: 'advanced',
        component: AgencyAdvancedComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'person',
        component: AgencyPersonListComponent,
        canActivate: [adminGuard],
        resolve: { data: AgencyPersonListResolver }
    },
    {
        path: 'payments',
        component: AgencyPaymentListComponent,
        canActivate: [adminGuard],
        resolve: { data: AgencyPaymentListResolver }
    },
    {
        path: '',
        redirectTo: 'manage',
        pathMatch: 'full'
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgencyRoutingModule { }
