import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyingBillListComponent } from './components/buying-bill-list/buying-bill-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { BuyingBillListResolver } from './resolvers/buying-bill-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: BuyingBillListComponent,
        canActivate: [adminGuard],
        resolve: { data: BuyingBillListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BuyingBillRoutingModule { }
