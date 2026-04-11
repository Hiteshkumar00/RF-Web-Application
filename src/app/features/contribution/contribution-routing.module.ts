import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContributionListComponent } from './components/add-contribution-list/add-contribution-list.component';
import { RemoveContributionListComponent } from './components/remove-contribution-list/remove-contribution-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
    {
        path: 'add',
        component: AddContributionListComponent,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'remove',
        component: RemoveContributionListComponent,
        canActivate: [authGuard, adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContributionRoutingModule { }
