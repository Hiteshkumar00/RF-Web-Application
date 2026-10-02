import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ImportExcelWizardComponent, ColumnConfig } from '../../../shared/components/import-excel-wizard/import-excel-wizard.component';
import { AgencyPersonApiService } from './agency-person-api.service';
import { MessageService } from 'primeng/api';
import { ExcelService } from '../../../shared/services/excel.service';

@Injectable({
  providedIn: 'root'
})
export class AgencyPersonImportExportService {
  private dialogManager = inject(DialogManagerService);
  private apiService = inject(AgencyPersonApiService);
  private messageService = inject(MessageService);
  private excelService = inject(ExcelService);

  exportToExcel(): void {
    this.apiService.export().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AgencyPersons.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export agency persons' });
      }
    });
  }

  exportForImport(persons: any[]): void {
    const data = persons.map(item => ({
      'Agency Name': item.agencyName || '',
      'Person Name': item.personName || '',
      'Mobile No': item.mobileNo || '',
      'Email': item.email || '',
      'Position': item.position || '',
      'Address': item.address || ''
    }));
    this.excelService.exportAsExcelFile(data, 'AgencyPersons_Import_Template');
  }

  async openImportWizard(onSuccess: () => void): Promise<void> {
    const columns: ColumnConfig[] = [
      { field: 'agencyName', header: 'Agency Name', type: 'text', required: true },
      { field: 'name', header: 'Person Name', type: 'text', required: true },
      { field: 'phoneNo', header: 'Mobile No', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'personOccupation', header: 'Position', type: 'text' },
      { field: 'address', header: 'Address', type: 'text' }
    ];

    const validateFn = (row: any): string[] => {
      const errors: string[] = [];
      if (!row.agencyName?.toString().trim()) errors.push('Agency Name is required.');
      if (!row.name?.toString().trim()) errors.push('Person Name is required.');
      return errors;
    };

    const ref = await this.dialogManager.openAsync(
      ImportExcelWizardComponent,
      {
        inputs: {
          visible: true,
          title: 'Import Agency Persons',
          columns,
          validateRowFn: validateFn,
          importFn: (data: any[]) => this.apiService.import(data),
          successLabel: 'Agency Persons',
          onImportSuccess: () => { onSuccess(); this.dialogManager.destroy(ref); },
          onClose: () => this.dialogManager.destroy(ref)
        }
      }
    );
  }
}
