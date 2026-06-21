import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { EntityFormDialogComponent } from '../components/entity-form-dialog/entity-form-dialog.component';
import { EntityViewDialogComponent } from '../components/entity-view-dialog/entity-view-dialog.component';
import { EntityDto } from '../models/entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntityDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update',
    entity: EntityDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      EntityFormDialogComponent,
      { visible: true, mode, entity },
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

  openView(entity: EntityDto | null, onClosed: () => void): void {
    const ref = this.dialogManager.open(
      EntityViewDialogComponent,
      { visible: true, entity },
      {
        closed: () => {
          onClosed();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
