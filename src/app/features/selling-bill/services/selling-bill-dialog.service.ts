import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { SellingBillFormDialogComponent } from '../components/selling-bill-form-dialog/selling-bill-form-dialog.component';
import { SellingBillPaymentDialogComponent } from '../components/selling-bill-payment-dialog/selling-bill-payment-dialog.component';
import { SellingBillListDto } from '../models/selling-bill.model';
import { DropdownService } from '../../../shared/services/dropdown.service';
import { ProductApiService } from '../../product/services/product-api.service';
import { SellingBillApiService } from './selling-bill-api.service';
import { CustomerApiService } from '../../customer/services/customer-api.service';

@Injectable({
  providedIn: 'root'
})
export class SellingBillDialogService {
  private dialogManager = inject(DialogManagerService);
  private dropdownService = inject(DropdownService);
  private productApiService = inject(ProductApiService);
  private sellingBillApiService = inject(SellingBillApiService);
  private customerApiService = inject(CustomerApiService);

  async openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      SellingBillFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          allCustomers: this.customerApiService.getAll(),
          accountOptions: this.dropdownService.getPaymentAccountOptions(),
          products: this.productApiService.getAll(),
          billDetails: (mode === 'update' || mode === 'view') && id ? this.sellingBillApiService.getById(id) : Promise.resolve(null)
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

  async openPayment(
    bill: SellingBillListDto,
    onSaved: () => void,
    onClosed: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      SellingBillPaymentDialogComponent,
      {
        inputs: { visible: true, bill },
        resolve: {
          accountOptions: this.dropdownService.getPaymentAccountOptions(),
          billDetails: this.sellingBillApiService.getById(bill.id)
        },
        outputs: {
          saved: () => {
            onSaved();
            this.dialogManager.destroy(ref);
          },
          closed: () => {
            onClosed();
            this.dialogManager.destroy(ref);
          }
        }
      }
    );
  }
}
