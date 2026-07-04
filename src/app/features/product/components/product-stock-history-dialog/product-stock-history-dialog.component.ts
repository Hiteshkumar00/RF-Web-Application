import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { DashboardApiService } from '../../../dashboard/services/dashboard-api.service';
import { BuyingBillDialogService } from '../../../buying-bill/services/buying-bill-dialog.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';

@Component({
  selector: 'app-product-stock-history-dialog',
  templateUrl: './product-stock-history-dialog.component.html',
  standalone: false
})
export class ProductStockHistoryDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() productId!: number;
  @Input() productName: string = '';
  @Output() onClose = new EventEmitter<void>();

  productHistory: any[] = [];
  loading: boolean = true;

  private dashboardApiService = inject(DashboardApiService);
  private buyingBillDialogService = inject(BuyingBillDialogService);
  private excelService = inject(ExcelService);
  private helperService = inject(HelperService);

  ngOnInit(): void {
    if (this.productId) {
      this.loadHistory();
    } else {
      this.loading = false;
    }
  }

  loadHistory(): void {
    this.loading = true;
    this.dashboardApiService.getProductStockHistory(this.productId).subscribe({
      next: (history) => {
        this.productHistory = history;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewBill(billId: number): void {
    if (billId > 0) {
      this.buyingBillDialogService.openForm('view', billId, () => {}, () => {});
    }
  }

  close(): void {
    this.onClose.emit();
  }

  exportToExcel(): void {
    if (!this.productHistory || this.productHistory.length === 0) return;

    const exportData = this.productHistory.map(h => ({
      'Stock ID': h.stockId,
      'Bill ID': h.billId,
      'Bill No': h.billNo,
      'Agency Name': h.agencyName,
      'Buying Date': this.helperService.formatDate(h.date),
      'Total purchased quantity': h.quantity,
      'Purchased price per item': h.purchasePrice,
      'Discount per item': h.discountPerItem,
      'Net purchased price': h.netPurchasePrice,
      'Total discount': h.discount,
      'Total net purchased amount': h.totalNetPurchasedAmount,
      'Total sold': h.totalSold,
      'Total remaining': h.remainingQty
    }));

    this.excelService.exportAsExcelFile(exportData, this.productName || 'Stock_History');
  }
}
