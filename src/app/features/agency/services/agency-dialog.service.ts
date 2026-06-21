import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { AgencyFormDialogComponent } from '../components/agency-form-dialog/agency-form-dialog.component';
import { AgencyPersonFormDialogComponent } from '../components/agency-person-form-dialog/agency-person-form-dialog.component';
import { AgencyPaymentFormDialogComponent } from '../components/agency-payment-form-dialog/agency-payment-form-dialog.component';
import { AgencyDto } from '../models/agency.model';
import { AgencyPersonDto } from '../models/agency-person.model';

@Injectable({
  providedIn: 'root'
})
export class AgencyDialogService {
  private dialogManager = inject(DialogManagerService);

  openForm(
    mode: 'create' | 'update',
    agency: AgencyDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AgencyFormDialogComponent,
      { visible: true, mode, agency },
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

  openPersonForm(
    mode: 'create' | 'update' | 'view',
    person: AgencyPersonDto | null,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AgencyPersonFormDialogComponent,
      { visible: true, mode, person },
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

  openPaymentForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    agencyId: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): void {
    const ref = this.dialogManager.open(
      AgencyPaymentFormDialogComponent,
      { visible: true, mode, id, agencyId },
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
