import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentAccountListComponent } from './Components/payment-account-list/payment-account-list.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: PaymentAccountListComponent,
        canActivate: [adminGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentAccountManagementRoutingModule { }
