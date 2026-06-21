import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { CustomerFormDialogComponent } from '../components/customer-form-dialog/customer-form-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      CustomerFormDialogComponent,
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
