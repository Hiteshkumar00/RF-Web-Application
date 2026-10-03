import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ImportExcelWizardComponent, ColumnConfig } from '../../../shared/components/import-excel-wizard/import-excel-wizard.component';
import { ProductApiService } from './product-api.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ProductImportExportService {
  private dialogManager = inject(DialogManagerService);
  private apiService = inject(ProductApiService);
  private messageService = inject(MessageService);


  exportForImport(): void {
    this.apiService.export().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Products_Import_Template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export products template' });
      }
    });
  }

  async openImportWizard(onSuccess: () => void): Promise<void> {
    const columns: ColumnConfig[] = [
      { field: 'productName', header: 'Product Name', type: 'text', required: true, unique: true },
      { field: 'warrantyYear', header: 'Warranty Year', type: 'number' },
      { field: 'warrantyMonth', header: 'Warranty Month', type: 'number' },
      { field: 'warrantyDay', header: 'Warranty Day', type: 'number' },
      { field: 'imageLink', header: 'Image Link', type: 'text' }
    ];

    const validateFn = (row: any): string[] => {
      const errors: string[] = [];
      if (!row.productName?.toString().trim()) errors.push('Product Name is required.');
      if (row.warrantyYear !== null && row.warrantyYear !== undefined && isNaN(Number(row.warrantyYear)))
        errors.push('Warranty Year must be numeric.');
      if (row.warrantyMonth !== null && row.warrantyMonth !== undefined && isNaN(Number(row.warrantyMonth)))
        errors.push('Warranty Month must be numeric.');
      if (row.warrantyDay !== null && row.warrantyDay !== undefined && isNaN(Number(row.warrantyDay)))
        errors.push('Warranty Day must be numeric.');
      return errors;
    };

    const ref = await this.dialogManager.openAsync(
      ImportExcelWizardComponent,
      {
        inputs: {
          visible: true,
          title: 'Import Products',
          columns,
          validateRowFn: validateFn,
          importFn: (data: any[]) => this.apiService.import(data),
          successLabel: 'Products',
          onImportSuccess: () => { onSuccess(); this.dialogManager.destroy(ref); },
          onClose: () => this.dialogManager.destroy(ref)
        }
      }
    );
  }
}
