import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ImportExcelWizardComponent, ColumnConfig } from '../../../shared/components/import-excel-wizard/import-excel-wizard.component';
import { AgencyApiService } from './agency-api.service';
import { MessageService } from 'primeng/api';
import { ExcelService } from '../../../shared/services/excel.service';

@Injectable({
  providedIn: 'root'
})
export class AgencyImportExportService {
  private dialogManager = inject(DialogManagerService);
  private apiService = inject(AgencyApiService);
  private messageService = inject(MessageService);
  private excelService = inject(ExcelService);

  exportToExcel(): void {
    this.apiService.export().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Agencies.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export agencies' });
      }
    });
  }

  exportForImport(agencies: any[]): void {
    const data = agencies.map(item => ({
      'Agency Name': item.agencyName || '',
      'Address': item.address || ''
    }));
    this.excelService.exportAsExcelFile(data, 'Agencies_Import_Template');
  }

  async openImportWizard(onSuccess: () => void): Promise<void> {
    const columns: ColumnConfig[] = [
      { field: 'agencyName', header: 'Agency Name', type: 'text', required: true, unique: true },
      { field: 'address', header: 'Address', type: 'text' }
    ];

    const validateFn = (row: any): string[] => {
      const errors: string[] = [];
      if (!row.agencyName?.toString().trim()) errors.push('Agency Name is required.');
      return errors;
    };

    const ref = await this.dialogManager.openAsync(
      ImportExcelWizardComponent,
      {
        inputs: {
          visible: true,
          title: 'Import Agencies',
          columns,
          validateRowFn: validateFn,
          importFn: (data: any[]) => this.apiService.import(data),
          successLabel: 'Agencies',
          onImportSuccess: () => { onSuccess(); this.dialogManager.destroy(ref); },
          onClose: () => this.dialogManager.destroy(ref)
        }
      }
    );
  }
}
