import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './Components/user-list/user-list.component';
import { UserListResolver } from './resolvers/user-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: UserListComponent,
        resolve: { data: UserListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }
