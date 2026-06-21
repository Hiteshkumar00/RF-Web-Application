import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { ExpenseListResolver } from './resolvers/expense-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: ExpenseListComponent,
        canActivate: [adminGuard],
        resolve: { data: ExpenseListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExpenseRoutingModule { }
