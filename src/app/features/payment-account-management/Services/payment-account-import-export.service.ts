import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ImportExcelWizardComponent, ColumnConfig } from '../../../shared/components/import-excel-wizard/import-excel-wizard.component';
import { PaymentAccountApiService } from './payment-account-api.service';
import { MessageService } from 'primeng/api';
import { ExcelService } from '../../../shared/services/excel.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentAccountImportExportService {
  private dialogManager = inject(DialogManagerService);
  private apiService = inject(PaymentAccountApiService);
  private messageService = inject(MessageService);
  private excelService = inject(ExcelService);

  exportToExcel(): void {
    this.apiService.export().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BankAccounts.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export bank accounts' });
      }
    });
  }

  exportForImport(accounts: any[]): void {
    const data = accounts.map(item => ({
      'Method Name': item.methodName || ''
    }));
    this.excelService.exportAsExcelFile(data, 'BankAccounts_Import_Template');
  }

  async openImportWizard(onSuccess: () => void): Promise<void> {
    const columns: ColumnConfig[] = [
      { field: 'methodName', header: 'Method Name', type: 'text', required: true, unique: true }
    ];

    const validateFn = (row: any): string[] => {
      const errors: string[] = [];
      if (!row.methodName?.toString().trim()) errors.push('Method Name is required.');
      return errors;
    };

    const ref = await this.dialogManager.openAsync(
      ImportExcelWizardComponent,
      {
        inputs: {
          visible: true,
          title: 'Import Bank Accounts',
          columns,
          validateRowFn: validateFn,
          importFn: (data: any[]) => this.apiService.import(data),
          successLabel: 'Bank Accounts',
          onImportSuccess: () => { onSuccess(); this.dialogManager.destroy(ref); },
          onClose: () => this.dialogManager.destroy(ref)
        }
      }
    );
  }
}
