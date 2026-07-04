import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentAccountListComponent } from './Components/payment-account-list/payment-account-list.component';
import { PaymentHistoryListComponent } from './Components/payment-history-list/payment-history-list.component';
import { PaymentTransferListComponent } from './Components/payment-transfer-list/payment-transfer-list.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { PaymentAccountListResolver } from './resolvers/payment-account-list.resolver';
import { PaymentHistoryListResolver } from './resolvers/payment-history-list.resolver';
import { PaymentTransferListResolver } from './resolvers/payment-transfer-list.resolver';

const routes: Routes = [
    {
        path: '',
        component: PaymentAccountListComponent,
        canActivate: [adminGuard],
        resolve: { data: PaymentAccountListResolver }
    },
    {
        path: 'history',
        component: PaymentHistoryListComponent,
        canActivate: [adminGuard],
        resolve: { data: PaymentHistoryListResolver }
    },
    {
        path: 'transfer',
        component: PaymentTransferListComponent,
        canActivate: [adminGuard],
        resolve: { data: PaymentTransferListResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentAccountManagementRoutingModule { }
