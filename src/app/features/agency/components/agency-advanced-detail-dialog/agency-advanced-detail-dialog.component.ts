import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ViewAgencyAllDetailDto } from '../../models/agency-all-detail.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { BuyingBillDialogService } from '../../../buying-bill/services/buying-bill-dialog.service';

@Component({
  selector: 'app-agency-advanced-detail-dialog',
  standalone: false,
  templateUrl: './agency-advanced-detail-dialog.component.html'
})
export class AgencyAdvancedDetailDialogComponent {
  private buyingBillDialogService = inject(BuyingBillDialogService);

  @Input() visible = false;
  @Input() selectedDetail: ViewAgencyAllDetailDto | null = null;
  @Output() onClose = new EventEmitter<void>();

  labels = AgencyLabels;
  expandedYearRows: any = {};

  get billStatisticCards() {
    if (!this.selectedDetail) return [];
    return [
      {
        title: this.labels.TOTAL_BILLS,
        amount: this.selectedDetail.totalBillsAmount,
        colorClass: 'info',
        icon: 'pi-file'
      },
      {
        title: this.labels.TOTAL_PAID,
        amount: this.selectedDetail.totalPaidAmount,
        colorClass: 'success',
        icon: 'pi-check-circle'
      },
      {
        title: this.labels.TOTAL_REMAINING,
        amount: this.selectedDetail.totalPendingAmount,
        colorClass: 'danger',
        icon: 'pi-clock',
        isRemaining: true
      }
    ];
  }

  get expenseStatisticCards() {
    if (!this.selectedDetail) return [];
    return [
      {
        title: 'TOTAL EXPENSES',
        amount: this.selectedDetail.totalExpenceAmount,
        colorClass: 'warning',
        icon: 'pi-truck'
      },
      {
        title: 'EXPENSES PAID',
        amount: this.selectedDetail.totalExpencePaidAmount,
        colorClass: 'success',
        icon: 'pi-check-circle'
      },
      {
        title: 'EXPENSES REMAINING',
        amount: this.selectedDetail.totalExpencePendingAmount,
        colorClass: 'danger',
        icon: 'pi-clock',
        isRemaining: true
      }
    ];
  }

  closeDetailDialog(): void {
    this.onClose.emit();
  }

  openViewBuyingBill(billId: number): void {
    this.buyingBillDialogService.openForm(
      'view',
      billId,
      () => { },
      () => { }
    );
  }
}
