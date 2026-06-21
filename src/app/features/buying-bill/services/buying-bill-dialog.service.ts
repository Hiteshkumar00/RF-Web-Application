import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { BuyingBillFormDialogComponent } from '../components/buying-bill-form-dialog/buying-bill-form-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class BuyingBillDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      BuyingBillFormDialogComponent,
      { visible: true, mode, id },
      {
        onSave: () => {
          onSave();
          this.dialogManager.destroy(ref);
        },
        onClose: () => {
          onClose();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
