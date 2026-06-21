import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { AccountFormDialogComponent } from '../components/account-form-dialog/account-form-dialog.component';
import { AccountDto } from '../models/account.model';
import { DropdownService } from '../../../shared/services/dropdown.service';

@Injectable({
  providedIn: 'root'
})
export class AccountDialogService {
  private dialogManager = inject(DialogManagerService);
  private dropdownService = inject(DropdownService);

  async openForm(
    mode: 'create' | 'update' | 'view',
    account: AccountDto | null,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      AccountFormDialogComponent,
      {
        inputs: { visible: true, mode, account },
        resolve: {
          currencyOptions: this.dropdownService.getOptionsByEntityName('Currency')
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
}
