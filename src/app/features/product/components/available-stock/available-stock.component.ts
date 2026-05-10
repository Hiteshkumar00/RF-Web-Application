import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from '../../../dashboard/services/dashboard-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';

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
  showFormDialog = false;
  formDialogMode: 'create' | 'update' | 'view' = 'create';
  selectedId?: number;


  constructor(
    private dashboardApiService: DashboardApiService,
    public globalConfig: GlobalConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
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
    this.formDialogMode = 'update';
    this.selectedId = productId;
    this.showFormDialog = true;
  }

  openViewDialog(productId: number): void {
    this.formDialogMode = 'view';
    this.selectedId = productId;
    this.showFormDialog = true;
  }


  onFormSaved(): void {
    this.loadData();
  }

  onFormDialogClosed(): void {
    this.showFormDialog = false;
  }
}
