import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { UserFormDialogComponent } from '../Components/user-form-dialog/user-form-dialog.component';
import { UserViewDialogComponent } from '../Components/user-view-dialog/user-view-dialog.component';
import { UserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update',
    user: UserDto | null,
    onSaved: () => void,
    onClosed: () => void
  ): void {
    const ref = this.dialogManager.open(
      UserFormDialogComponent,
      { visible: true, mode, user },
      {
        saved: () => {
          onSaved();
          this.dialogManager.destroy(ref);
        },
        closed: () => {
          onClosed();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }

  openView(user: UserDto | null, onClosed: () => void): void {
    const ref = this.dialogManager.open(
      UserViewDialogComponent,
      { visible: true, user },
      {
        closed: () => {
          onClosed();
          this.dialogManager.destroy(ref);
        }
      }
    );
  }
}
