import { Injectable, inject } from '@angular/core';
import { DialogManagerService } from '../../../core/services/dialog-manager.service';
import { ImportExcelWizardComponent, ColumnConfig } from '../../../shared/components/import-excel-wizard/import-excel-wizard.component';
import { ProductApiService } from './product-api.service';
import { MessageService } from 'primeng/api';
import { ProductConstants } from '../constants/product.constants';

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
      { field: 'price', header: 'Price', type: 'number' },
      { field: 'warrantyYear', header: 'Warranty Year', type: 'number' },
      { field: 'warrantyMonth', header: 'Warranty Month', type: 'number' },
      { field: 'warrantyDay', header: 'Warranty Day', type: 'number' },
      { field: 'imageLink', header: 'Image Link', type: 'text' }
    ];

    const validateFn = (row: any): string[] => {
      const errors: string[] = [];
      const msgs = ProductConstants.MESSAGES.IMPORT_ERRORS;

      if (!row.productName?.toString().trim()) errors.push(msgs.PRODUCT_NAME_REQUIRED);
      if (row.warrantyYear !== null && row.warrantyYear !== undefined) {
        const y = Number(row.warrantyYear);
        if (isNaN(y)) errors.push(msgs.WARRANTY_YEAR_NUMERIC);
        else if (y < 0) errors.push(msgs.WARRANTY_YEAR_MIN);
      }
      if (row.warrantyMonth !== null && row.warrantyMonth !== undefined) {
        const m = Number(row.warrantyMonth);
        if (isNaN(m)) errors.push(msgs.WARRANTY_MONTH_NUMERIC);
        else if (m < 0) errors.push(msgs.WARRANTY_MONTH_MIN);
      }
      if (row.warrantyDay !== null && row.warrantyDay !== undefined) {
        const d = Number(row.warrantyDay);
        if (isNaN(d)) errors.push(msgs.WARRANTY_DAY_NUMERIC);
        else if (d < 0) errors.push(msgs.WARRANTY_DAY_MIN);
      }
      if (row.price !== null && row.price !== undefined) {
        const p = Number(row.price);
        if (isNaN(p)) errors.push(msgs.PRICE_NUMERIC);
        else if (p < 0) errors.push(msgs.PRICE_MIN);
      }
      return errors;
    };

    const dummyData = [{
      'Product Name': 'Sample Furniture',
      'Price': 1500,
      'Warranty Year': 1,
      'Warranty Month': 6,
      'Warranty Day': 0,
      'Image Link': 'https://example.com/image.jpg'
    }];

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
          templateDummyData: dummyData,
          onImportSuccess: () => { onSuccess(); this.dialogManager.destroy(ref); },
          onClose: () => this.dialogManager.destroy(ref)
        }
      }
    );
  }
}
