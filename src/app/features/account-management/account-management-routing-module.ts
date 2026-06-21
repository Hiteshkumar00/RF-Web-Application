import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountListResolver } from './resolvers/account-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: AccountListComponent,
        resolve: { data: AccountListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
