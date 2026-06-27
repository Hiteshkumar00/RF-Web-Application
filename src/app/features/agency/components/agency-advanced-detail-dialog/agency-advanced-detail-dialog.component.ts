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

  closeDetailDialog(): void {
    this.onClose.emit();
  }

  openViewBuyingBill(billId: number): void {
    this.buyingBillDialogService.openForm(
      'view',
      billId,
      () => {},
      () => {}
    );
  }
}
