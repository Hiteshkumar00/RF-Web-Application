import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { AddContributionFormDialogComponent } from '../components/add-contribution-form-dialog/add-contribution-form-dialog.component';
import { RemoveContributionFormDialogComponent } from '../components/remove-contribution-form-dialog/remove-contribution-form-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ContributionDialogService {
  private dialogManager = inject(DialogManagerService);

  openAddForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AddContributionFormDialogComponent,
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

  openRemoveForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      RemoveContributionFormDialogComponent,
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
