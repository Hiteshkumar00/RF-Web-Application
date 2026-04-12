import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyingBillListComponent } from './components/buying-bill-list/buying-bill-list.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: BuyingBillListComponent,
        canActivate: [adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BuyingBillRoutingModule { }
