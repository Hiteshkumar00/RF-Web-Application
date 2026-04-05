import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPersonListComponent } from './Components/account-person-list/account-person-list.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: AccountPersonListComponent,
        canActivate: [adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountPersonManagementRoutingModule { }
