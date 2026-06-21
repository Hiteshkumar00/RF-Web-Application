import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ExpenseFormDialogComponent } from '../components/expense-form-dialog/expense-form-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update' | 'view',
    expenseId: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      ExpenseFormDialogComponent,
      { visible: true, mode, expenseId },
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
