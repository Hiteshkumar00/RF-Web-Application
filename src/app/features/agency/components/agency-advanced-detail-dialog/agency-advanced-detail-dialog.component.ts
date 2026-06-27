import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewAgencyAllDetailDto } from '../../models/agency-all-detail.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';

@Component({
  selector: 'app-agency-advanced-detail-dialog',
  standalone: false,
  templateUrl: './agency-advanced-detail-dialog.component.html'
})
export class AgencyAdvancedDetailDialogComponent {
  @Input() visible = false;
  @Input() selectedDetail: ViewAgencyAllDetailDto | null = null;
  @Output() onClose = new EventEmitter<void>();

  labels = AgencyLabels;
  expandedYearRows: any = {};

  closeDetailDialog(): void {
    this.onClose.emit();
  }
}
