import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { superAdminGuard } from './core/guards/super-admin.guard';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // SuperAdmin Access modules
  {
    path: 'account-management',
    canActivate: [authGuard, superAdminGuard],
    loadChildren: () => import('./features/account-management/account-management-module').then(m => m.AccountManagementModule)
  },
  {
    path: 'user-management',
    canActivate: [authGuard, superAdminGuard],
    loadChildren: () => import('./features/user-management/user-management-module').then(m => m.UserManagementModule)
  },
  {
    path: 'entity',
    canActivate: [authGuard, superAdminGuard],
    loadChildren: () => import('./features/entity/entity-module').then(m => m.EntityModule)
  },

  // Admin and SuperAdmin Access Modules 
  {
    path: 'dashboard',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'inventory',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/inventory/inventory-module').then(m => m.InventoryModule)
  },
  {
    path: 'account-person-management',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/account-person-management/account-person-management-module').then(m => m.AccountPersonManagementModule)
  },
  {
    path: 'payment-account-management',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/payment-account-management/payment-account-management.module').then(m => m.PaymentAccountManagementModule)
  },
  {
    path: 'business-year',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/business-year/business-year.module').then(m => m.BusinessYearModule)
  },
  {
    path: 'agency',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/agency/agency-module').then(m => m.AgencyModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
