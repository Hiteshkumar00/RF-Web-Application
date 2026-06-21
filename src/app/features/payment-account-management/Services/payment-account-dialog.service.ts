import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { PaymentAccountFormDialogComponent } from '../Components/payment-account-form-dialog/payment-account-form-dialog.component';
import { PaymentAccountViewDialogComponent } from '../Components/payment-account-view-dialog/payment-account-view-dialog.component';
import { PaymentTransferFormDialogComponent } from '../Components/payment-transfer-form-dialog/payment-transfer-form-dialog.component';
import { PaymentAccountDto } from '../models/payment-account.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentAccountDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update',
    account: PaymentAccountDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      PaymentAccountFormDialogComponent,
      { visible: true, mode, account },
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

  openView(
    account: PaymentAccountDto | null,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      PaymentAccountViewDialogComponent,
      { visible: true, account },
      {
        closed: () => {
          onClose();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }

  openTransferForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      PaymentTransferFormDialogComponent,
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
