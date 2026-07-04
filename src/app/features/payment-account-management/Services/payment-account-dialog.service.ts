import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { PaymentAccountFormDialogComponent } from '../Components/payment-account-form-dialog/payment-account-form-dialog.component';
import { PaymentAccountViewDialogComponent } from '../Components/payment-account-view-dialog/payment-account-view-dialog.component';
import { PaymentTransferFormDialogComponent } from '../Components/payment-transfer-form-dialog/payment-transfer-form-dialog.component';
import { PaymentAccountDto } from '../models/payment-account.model';
import { DropdownService } from '../../../shared/services/dropdown.service';
import { PaymentAccountApiService } from './payment-account-api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentAccountDialogService {
  private dialogManager = inject(DialogManagerService);
  private dropdownService = inject(DropdownService);
  private paymentAccountApiService = inject(PaymentAccountApiService);

  async openForm(
    mode: 'create' | 'update',
    account: PaymentAccountDto | null,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      PaymentAccountFormDialogComponent,
      {
        inputs: { visible: true, mode, account },
        resolve: {
          personOptions: this.dropdownService.getAccountPersonOptions()
        },
        outputs: {
          saved: () => {
            onSave();
            this.dialogManager.destroy(ref);
          },
          closed: () => {
            onClose();
            this.dialogManager.destroy(ref);
          }
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

  async openTransferForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      PaymentTransferFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          accountOptions: this.dropdownService.getPaymentAccountOptions(),
          transferData: (mode === 'update' || mode === 'view') && id ? this.paymentAccountApiService.getTransferById(id) : Promise.resolve(null)
        },
        outputs: {
          onSave: () => {
            onSave();
            this.dialogManager.destroy(ref);
          },
          onClose: () => {
            onClose();
            this.dialogManager.destroy(ref);
          }
        }
      }
    );
  }
}
