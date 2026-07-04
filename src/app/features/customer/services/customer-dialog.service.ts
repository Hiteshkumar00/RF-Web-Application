import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { CustomerFormDialogComponent } from '../components/customer-form-dialog/customer-form-dialog.component';
import { CustomerApiService } from './customer-api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerDialogService {
  private dialogManager = inject(DialogManagerService);
  private apiService = inject(CustomerApiService);

  async openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      CustomerFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          customerData: (mode === 'update' || mode === 'view') && id ? this.apiService.getById(id) : Promise.resolve(null)
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

  async openSellingBills(customerId: number, customerName: string): Promise<void> {
    const { SellingBillListComponent } = await import('../../selling-bill/components/selling-bill-list/selling-bill-list.component');
    
    const ref = await this.dialogManager.openAsync(
      SellingBillListComponent,
      {
        inputs: { isDialog: true, visible: true, customerId: customerId },
        outputs: {
          closeDialog: () => {
            this.dialogManager.destroy(ref);
          }
        }
      }
    );
  }
}
