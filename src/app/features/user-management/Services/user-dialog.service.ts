import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { UserFormDialogComponent } from '../Components/user-form-dialog/user-form-dialog.component';
import { UserViewDialogComponent } from '../Components/user-view-dialog/user-view-dialog.component';
import { UserDto } from '../models/user.model';
import { AuthApiService } from '../../auth/services/auth-api.service';
import { DropdownService } from '../../../shared/services/dropdown.service';

@Injectable({
  providedIn: 'root'
})
export class UserDialogService {
  private dialogManager = inject(DialogManagerService);
  private authApiService = inject(AuthApiService);
  private dropdownService = inject(DropdownService);

  async openForm(
    mode: 'create' | 'update',
    user: UserDto | null,
    onSaved: () => void,
    onClosed: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      UserFormDialogComponent,
      {
        inputs: { visible: true, mode, user },
        resolve: {
          roleOptions: this.authApiService.getUserRoleOptions(),
          accountOptions: this.dropdownService.getAccountOptions()
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
