import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyListComponent } from './components/agency-list/agency-list.component';
import { AgencyAdvancedComponent } from './components/agency-advanced/agency-advanced.component';
import { AgencyPersonListComponent } from './components/agency-person-list/agency-person-list.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: 'manage',
        component: AgencyListComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'advanced',
        component: AgencyAdvancedComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'person',
        component: AgencyPersonListComponent,
        canActivate: [adminGuard]
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
