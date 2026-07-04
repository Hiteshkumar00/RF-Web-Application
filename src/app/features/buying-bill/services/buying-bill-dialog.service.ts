import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { BuyingBillFormDialogComponent } from '../components/buying-bill-form-dialog/buying-bill-form-dialog.component';
import { DropdownService } from '../../../shared/services/dropdown.service';
import { ProductApiService } from '../../product/services/product-api.service';
import { BuyingBillApiService } from './buying-bill-api.service';
import { AccountDetailsService } from '../../../core/services/account-details.service';

@Injectable({
  providedIn: 'root'
})
export class BuyingBillDialogService {
  private dialogManager = inject(DialogManagerService);
  private dropdownService = inject(DropdownService);
  private productApiService = inject(ProductApiService);
  private buyingBillApiService = inject(BuyingBillApiService);
  private accountDetailsService = inject(AccountDetailsService);

  async openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      BuyingBillFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          agencyOptions: this.dropdownService.getAgencyOptions(),
          paymentAccountOptions: this.dropdownService.getPaymentAccountOptions(),
          products: this.productApiService.getAll(),
          expenseTypeSuggestions: this.accountDetailsService.enableSuggestions ? this.buyingBillApiService.getExpenceTypeSuggestions() : Promise.resolve([]),
          billDetails: (mode === 'update' || mode === 'view') && id ? this.buyingBillApiService.getById(id) : Promise.resolve(null)
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
