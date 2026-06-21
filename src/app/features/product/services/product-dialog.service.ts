import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ProductFormDialogComponent } from '../components/product-dialog/product-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ProductDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      ProductFormDialogComponent,
      { visible: true, mode, id },
      {
        onSave: () => {
          onSave();
          this.dialogManager.destroy(ref);
        },
        onClose: () => {
          onClose();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
