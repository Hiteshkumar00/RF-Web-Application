import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from '../../../dashboard/services/dashboard-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDialogService } from '../../services/product-dialog.service';
import { BuyingBillDialogService } from '../../../buying-bill/services/buying-bill-dialog.service';
import { inject } from '@angular/core';
import { DialogManagerService } from '../../../../core/services/dialog-manager.service';
import { ProductStockHistoryDialogComponent } from '../product-stock-history-dialog/product-stock-history-dialog.component';

@Component({
  selector: 'app-available-stock',
  standalone: false,
  templateUrl: './available-stock.component.html'
})
export class AvailableStockComponent implements OnInit {
  productProfits: any[] = [];
  loading: boolean = false;
  selectedProductName: string = '';
  displayHistoryDialog: boolean = false;
  isHistoryLoading: boolean = false;
  selectedProductHistory: any[] = [];

  private productDialogService = inject(ProductDialogService);
  private dialogManager = inject(DialogManagerService);
  private buyingBillDialogService = inject(BuyingBillDialogService);
  private router = inject(Router);

  constructor(
    private dashboardApiService: DashboardApiService,
    public globalConfig: GlobalConfigService,
    private route: ActivatedRoute,
    private excelService: ExcelService
  ) { }

  exportToExcel(): void {
    const data = this.productProfits.map(item => ({
      'Product Name': item.productName,
      'Buyed Quantity': item.totalPurchaseCount || 0,
      'Selled Quantity': item.totalSoldCount || 0,
      'Total Buying Amount': item.totalPurchaseCost || 0,
      'Total Selling Amount': item.totalSellingAmount || 0,
      'Total Profit': item.totalProfit || 0,
      'Current Stock': item.availableStock || 0
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

  getStockSeverity(stock: number): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' | null | undefined {
    if (stock > 10) return 'success';
    if (stock > 0) return 'warn';
    return 'danger';
  }

  async openHistoryDialog(product: any): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      ProductStockHistoryDialogComponent,
      {
        inputs: {
          visible: true,
          productId: product.productId,
          productName: product.productName
        },
        outputs: {
          onClose: () => {
            this.dialogManager.destroy(ref);
          }
        }
      }
    );
  }

  openEditDialog(productId: number): void {
    this.productDialogService.openForm('update', productId, () => this.onFormSaved(), () => { });
  }

  openViewDialog(productId: number): void {
    this.productDialogService.openForm('view', productId, () => this.onFormSaved(), () => { });
  }

  onFormSaved(): void {
    this.loadData();
  }
}
