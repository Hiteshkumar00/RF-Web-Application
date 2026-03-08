import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'main-dashboard',
    loadChildren: () => import('./features/Dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./features/inventory/inventory-module').then(m => m.InventoryModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
