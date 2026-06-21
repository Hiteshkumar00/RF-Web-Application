import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPersonListComponent } from './Components/account-person-list/account-person-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { AccountPersonListResolver } from './resolvers/account-person-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: AccountPersonListComponent,
        canActivate: [adminGuard],
        resolve: { data: AccountPersonListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountPersonManagementRoutingModule { }
