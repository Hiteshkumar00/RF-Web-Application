import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { AccountFormDialogComponent } from '../components/account-form-dialog/account-form-dialog.component';
import { AccountDto } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update' | 'view',
    account: AccountDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AccountFormDialogComponent,
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
}
