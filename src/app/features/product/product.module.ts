import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormDialogComponent } from './components/product-dialog/product-dialog.component';
import { AvailableStockComponent } from './components/available-stock/available-stock.component';
import { ProductListResolver } from './resolvers/product-list.resolver';
import { AvailableStockResolver } from './resolvers/available-stock.resolver';
import { ProductStockHistoryDialogComponent } from './components/product-stock-history-dialog/product-stock-history-dialog.component';

import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormDialogComponent,
    AvailableStockComponent,
    ProductStockHistoryDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'manage', component: ProductListComponent, resolve: { data: ProductListResolver } },
      { path: 'available-stock', component: AvailableStockComponent, resolve: { data: AvailableStockResolver } }
    ])
  ],
  exports: [
    ProductFormDialogComponent
  ],
  providers: [
    DialogService
  ]
})
export class ProductModule { }
