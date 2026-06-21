import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { SellingBillFormDialogComponent } from '../components/selling-bill-form-dialog/selling-bill-form-dialog.component';
import { SellingBillPaymentDialogComponent } from '../components/selling-bill-payment-dialog/selling-bill-payment-dialog.component';
import { SellingBillListDto } from '../models/selling-bill.model';

@Injectable({
  providedIn: 'root'
})
export class SellingBillDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      SellingBillFormDialogComponent,
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

  openPayment(
    bill: SellingBillListDto,
    onSaved: () => void,
    onClosed: () => void
  ): void {
    const ref = this.dialogManager.open(
      SellingBillPaymentDialogComponent,
      { visible: true, bill },
      {
        saved: () => {
          onSaved();
          this.dialogManager.destroy(ref);
        },
        closed: () => {
          onClosed();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
