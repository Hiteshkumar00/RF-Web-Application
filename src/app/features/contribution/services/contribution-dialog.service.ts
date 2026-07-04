import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { AddContributionFormDialogComponent } from '../components/add-contribution-form-dialog/add-contribution-form-dialog.component';
import { RemoveContributionFormDialogComponent } from '../components/remove-contribution-form-dialog/remove-contribution-form-dialog.component';
import { DropdownService } from '../../../shared/services/dropdown.service';
import { AddContributionApiService } from './add-contribution-api.service';
import { RemoveContributionApiService } from './remove-contribution-api.service';

@Injectable({
  providedIn: 'root'
})
export class ContributionDialogService {
  private dialogManager = inject(DialogManagerService);
  private dropdownService = inject(DropdownService);
  private addContributionApiService = inject(AddContributionApiService);
  private removeContributionApiService = inject(RemoveContributionApiService);

  async openAddForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      AddContributionFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          personOptions: this.dropdownService.getAccountPersonOptions(),
          accountOptions: this.dropdownService.getPaymentAccountOptions(),
          contributionData: (mode === 'update' || mode === 'view') && id ? this.addContributionApiService.getById(id) : Promise.resolve(null)
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

  async openRemoveForm(
    mode: 'create' | 'update' | 'view',
    id: number | undefined,
    onSave: () => void,
    onClose: () => void
  ): Promise<void> {
    const ref = await this.dialogManager.openAsync(
      RemoveContributionFormDialogComponent,
      {
        inputs: { visible: true, mode, id },
        resolve: {
          personOptions: this.dropdownService.getAccountPersonOptions(),
          accountOptions: this.dropdownService.getPaymentAccountOptions(),
          contributionData: (mode === 'update' || mode === 'view') && id ? this.removeContributionApiService.getById(id) : Promise.resolve(null)
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
}
