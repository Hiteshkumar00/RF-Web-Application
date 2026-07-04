import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { AccountPersonFormDialogComponent } from '../Components/account-person-form-dialog/account-person-form-dialog.component';
import { AccountPersonViewDialogComponent } from '../Components/account-person-view-dialog/account-person-view-dialog.component';
import { AccountPersonDto } from '../models/account-person.model';

@Injectable({
  providedIn: 'root'
})
export class AccountPersonDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update',
    person: AccountPersonDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AccountPersonFormDialogComponent,
      { visible: true, mode, person },
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
    person: AccountPersonDto | null,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AccountPersonViewDialogComponent,
      { visible: true, person },
      {
        closed: () => {
          onClose();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
