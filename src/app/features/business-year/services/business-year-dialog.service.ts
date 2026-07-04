import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { BusinessYearFormDialogComponent } from '../components/business-year-form-dialog/business-year-form-dialog.component';
import { BusinessYearListDto } from '../models/business-year-list-dto.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessYearDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'edit',
    businessYear: BusinessYearListDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      BusinessYearFormDialogComponent,
      { visible: true, mode, businessYear },
      {
        saved: () => {
          onSave();
          this.dialogManager.destroy(ref);
        },
        closed: () => {
          onClose();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
