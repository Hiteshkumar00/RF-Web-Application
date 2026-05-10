import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormDialogComponent } from './components/product-dialog/product-dialog.component';
import { AvailableStockComponent } from './components/available-stock/available-stock.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormDialogComponent,
    AvailableStockComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'manage', component: ProductListComponent },
      { path: 'available-stock', component: AvailableStockComponent }
    ])
  ]
})
export class ProductModule { }
