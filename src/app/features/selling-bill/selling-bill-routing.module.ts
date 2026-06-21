import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellingBillListComponent } from './components/selling-bill-list/selling-bill-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { SellingBillListResolver } from './resolvers/selling-bill-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: SellingBillListComponent,
        canActivate: [adminGuard],
        resolve: { data: SellingBillListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SellingBillRoutingModule { }
