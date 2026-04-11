import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellingBillListComponent } from './components/selling-bill-list/selling-bill-list.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: SellingBillListComponent,
        canActivate: [adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SellingBillRoutingModule { }
