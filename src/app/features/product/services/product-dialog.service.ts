import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ProductFormDialogComponent } from '../components/product-dialog/product-dialog.component';
import { MigratePriceDialogComponent } from '../components/migrate-price-dialog/migrate-price-dialog.component';
import { ProductApiService } from './product-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDialogService {
  private dialogManager = inject(DialogManagerService);
  private apiService = inject(ProductApiService);

  async openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      ProductFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          productData: (mode === 'update' || mode === 'view') && id ? this.apiService.getById(id) : Promise.resolve(null)
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

  async openMigratePrice(
    productIds: number[],
    onSave: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      MigratePriceDialogComponent,
      {
        inputs: { visible: true, productIds },
        outputs: {
          onSave: () => {
            onSave();
            this.dialogManager.destroy(ref);
          },
          onClose: () => {
            this.dialogManager.destroy(ref);
          }
        }
      }
    );
  }
}
