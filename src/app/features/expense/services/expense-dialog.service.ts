import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ExpenseFormDialogComponent } from '../components/expense-form-dialog/expense-form-dialog.component';
import { DropdownService } from '../../../shared/services/dropdown.service';
import { ExpenseApiService } from './expense-api.service';
import { AccountDetailsService } from '../../../core/services/account-details.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDialogService {
  private dialogManager = inject(DialogManagerService);
  private dropdownService = inject(DropdownService);
  private expenseApiService = inject(ExpenseApiService);
  private accountDetailsService = inject(AccountDetailsService);

  async openForm(
    mode: 'create' | 'update' | 'view',
    expenseId: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      ExpenseFormDialogComponent,
      {
        inputs: { visible: true, mode, expenseId },
        resolve: {
          accountOptions: this.dropdownService.getPaymentAccountOptions(),
          expenseData: (mode === 'update' || mode === 'view') && expenseId ? this.expenseApiService.getById(expenseId) : Promise.resolve(null),
          expenseTypeSuggestions: this.accountDetailsService.enableSuggestions ? this.expenseApiService.getExpenceTypeSuggestions() : Promise.resolve([])
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
