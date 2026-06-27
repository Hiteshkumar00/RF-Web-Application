import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from '../../../dashboard/services/dashboard-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDialogService } from '../../services/product-dialog.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-available-stock',
  standalone: false,
  templateUrl: './available-stock.component.html'
})
export class AvailableStockComponent implements OnInit {
  productProfits: any[] = [];
  loading: boolean = false;
  expandedRows: any = {};
  
  // Dialog controls
  private productDialogService = inject(ProductDialogService);

    constructor(
    private dashboardApiService: DashboardApiService,
    public globalConfig: GlobalConfigService,
    private route: ActivatedRoute,
    private excelService: ExcelService
  ) { }

  exportToExcel(): void {
    const data = this.productProfits.map(item => ({
      'Product Name': item.productName,
      'Sold Qty': item.totalSoldCount || 0,
      'Purchase Qty': item.totalPurchaseCount || 0,
      'Selling Amount': item.totalSellingAmount || 0,
      'Profit': item.totalProfit || 0,
      'Available Stock': item.availableStock || 0
    }));
    this.excelService.exportAsExcelFile(data, 'Available_Stock_And_Profit');
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['data']) {
        this.productProfits = data['data'].productProfits;
      } else {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.dashboardApiService.getProductProfitMetrics().subscribe({
      next: (data) => {
        this.productProfits = data.productProfits;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  expandAll() {
    this.expandedRows = this.productProfits.reduce((acc, p) => {
      acc[p.productId] = true;
      return acc;
    }, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  getStockSeverity(stock: number): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' | null | undefined {
    if (stock > 10) return 'success';
    if (stock > 0) return 'warn';
    return 'danger';
  }

  openEditDialog(productId: number): void {
    this.productDialogService.openForm('update', productId, () => this.onFormSaved(), () => {});
  }

  openViewDialog(productId: number): void {
    this.productDialogService.openForm('view', productId, () => this.onFormSaved(), () => {});
  }

  onFormSaved(): void {
    this.loadData();
  }
}
