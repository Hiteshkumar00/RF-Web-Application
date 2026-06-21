import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContributionListComponent } from './components/add-contribution-list/add-contribution-list.component';
import { RemoveContributionListComponent } from './components/remove-contribution-list/remove-contribution-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { authGuard } from '../../core/guards/auth.guard';
import { AddContributionListResolver } from './resolvers/add-contribution-list.resolver';
import { RemoveContributionListResolver } from './resolvers/remove-contribution-list.resolver';

const routes: Routes = [
    {
        path: 'add',
        component: AddContributionListComponent,
        canActivate: [authGuard, adminGuard],
        resolve: { data: AddContributionListResolver }
    },
    {
        path: 'remove',
        component: RemoveContributionListComponent,
        canActivate: [authGuard, adminGuard],
        resolve: { data: RemoveContributionListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContributionRoutingModule { }
