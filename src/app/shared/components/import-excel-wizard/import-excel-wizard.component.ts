import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ImportResult, ImportResultDialogComponent } from '../import-result-dialog/import-result-dialog.component';
import * as XLSX from 'xlsx';

export interface ColumnConfig {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'boolean';
  required?: boolean;
  unique?: boolean;
}

@Component({
  selector: 'app-import-excel-wizard',
  standalone: false,
  templateUrl: './import-excel-wizard.component.html',
  styleUrls: ['./import-excel-wizard.component.css']
})
export class ImportExcelWizardComponent implements OnDestroy {
  @Input() visible = false;
  @Input() title = 'Import Data';
  @Input() columns: ColumnConfig[] = [];
  @Input() validateRowFn?: (row: any) => string[];
  @Input() compositeUniqueFields?: string[]; // E.g. ['agencyName', 'name']

  /** The API function to call on submit. Receives cleaned row data, returns an Observable<ImportResult>. */
  @Input() importFn?: (data: any[]) => Observable<any>;
  /** Called after a successful import (no errors). Use to refresh the list and close the dialog. */
  @Input() onImportSuccess?: () => void;
  /** Called when the dialog is closed (X button or hideDialog). Use to destroy the dialog ref. */
  @Input() onClose?: () => void;
  /** Human-readable label for the entity, e.g. "Agencies" or "Products". Used in the success toast. */
  @Input() successLabel = 'Records';

  isSubmitting = false;
  currentStep = 1;
  excelData: any[] = [];
  excelHeaders: string[] = [];
  mappedData: any[] = [];
  columnMapping: { [key: string]: string } = {};

  showErrorModal = false;
  validationErrors: { row: number, message: string }[] = [];

  private importSub?: Subscription;

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnDestroy() {
    this.importSub?.unsubscribe();
  }

  hideDialog() {
    this.visible = false;
    this.reset();
    this.onClose?.();
  }

  reset() {
    this.currentStep = 1;
    this.excelData = [];
    this.excelHeaders = [];
    this.mappedData = [];
    this.columnMapping = {};
    this.showErrorModal = false;
    this.validationErrors = [];
    this.isSubmitting = false;
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot use multiple files' });
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data && data.length > 0) {
        this.excelHeaders = (data[0] as string[]).map(h => (h || '').toString().trim());
        const rows = data.slice(1);

        this.excelData = rows.map((row: any) => {
          let rowData: any = {};
          this.excelHeaders.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        this.autoMapColumns();
        this.generateMappedData();
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  autoMapColumns() {
    this.columnMapping = {};
    this.columns.forEach(col => {
      const match = this.excelHeaders.find(h =>
        h.toLowerCase() === col.header.toLowerCase() || h.toLowerCase() === col.field.toLowerCase()
      );
      this.columnMapping[col.field] = match ?? '';
    });
  }

  generateMappedData() {
    this.mappedData = [];
    this.excelData.forEach((row, index) => {
      let mappedRow: any = {};
      this.columns.forEach(col => {
        const excelHeader = this.columnMapping[col.field];
        if (excelHeader) {
          const rawVal = row[excelHeader];
          mappedRow[col.field] = (rawVal !== null && rawVal !== undefined) ? rawVal.toString().trim() : null;
        } else {
          mappedRow[col.field] = null;
        }
      });
      mappedRow['_tempId'] = Math.random().toString(36).substr(2, 9);
      mappedRow['_errors'] = [];
      mappedRow['_errorMap'] = {};
      mappedRow['rowNo'] = index + 2; // +1 for zero-index, +1 for header row
      this.mappedData.push(mappedRow);
    });
    this.validateAll();
  }

  updateMapping(field: string) {
    const excelHeader = this.columnMapping[field];
    this.mappedData.forEach((row, index) => {
      if (excelHeader) {
        const rawVal = this.excelData[index][excelHeader];
        row[field] = (rawVal !== null && rawVal !== undefined) ? rawVal.toString().trim() : null;
      } else {
        row[field] = null;
      }
    });
    this.validateAll();
  }

  getCellError(row: any, field: string): string | undefined {
    if (row['_errorMap']?.[field]) return row['_errorMap'][field];
    if (row['_errors']?.length > 0) {
      return row['_errors'].find((e: string) =>
        e.toLowerCase().includes(this.columns.find(c => c.field === field)?.header.toLowerCase() ?? field.toLowerCase())
      );
    }
    return undefined;
  }

  goToReview() {
    this.validateAll();
    const missingRequired = this.columns.filter(c => c.required && !this.columnMapping[c.field]);
    if (missingRequired.length > 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please map required columns: ${missingRequired.map(c => c.header).join(', ')}` });
      return;
    }

    this.validationErrors = [];
    this.mappedData.forEach((row, index) => {
      (row['_errors'] ?? []).forEach((err: string) => {
        this.validationErrors.push({ row: index + 1, message: err });
      });
    });

    if (this.validationErrors.length > 0) {
      this.showErrorModal = true;
      return;
    }

    this.currentStep = 2;
  }

  validateAll() {
    const uniqueValues: { [field: string]: Map<any, number[]> } = {};
    this.columns.filter(c => c.unique).forEach(c => {
      uniqueValues[c.field] = new Map();
    });

    this.mappedData.forEach((row) => {
      this.columns.filter(c => c.unique).forEach(c => {
        const val = row[c.field];
        if (val !== null && val !== undefined && val !== '') {
          if (!uniqueValues[c.field].has(val)) uniqueValues[c.field].set(val, []);
          uniqueValues[c.field].get(val)!.push(row['rowNo']);
        }
      });
    });

    const compositeUniqueMap = new Map<string, number[]>();
    if (this.compositeUniqueFields && this.compositeUniqueFields.length > 0) {
      this.mappedData.forEach(row => {
        const hasAllFields = this.compositeUniqueFields!.every(f => row[f] !== null && row[f] !== undefined && row[f] !== '');
        if (hasAllFields) {
          const valStr = this.compositeUniqueFields!.map(f => row[f]).join('|||');
          if (!compositeUniqueMap.has(valStr)) compositeUniqueMap.set(valStr, []);
          compositeUniqueMap.get(valStr)!.push(row['rowNo']);
        }
      });
    }

    this.mappedData.forEach((row) => {
      let errors: string[] = this.validateRowFn ? this.validateRowFn(row) : [];
      let errorMap: any = {};

      this.columns.filter(c => c.unique).forEach(c => {
        const val = row[c.field];
        if (val !== null && val !== undefined && val !== '') {
          if (uniqueValues[c.field].get(val)!.length > 1) {
            const errStr = `Duplicate ${c.header} found in the sheet.`;
            if (!errors.includes(errStr)) {
              errors.push(errStr);
              errorMap[c.field] = errStr;
            }
          }
        }
      });

      if (this.compositeUniqueFields && this.compositeUniqueFields.length > 0) {
        const hasAllFields = this.compositeUniqueFields!.every(f => row[f] !== null && row[f] !== undefined && row[f] !== '');
        if (hasAllFields) {
          const valStr = this.compositeUniqueFields!.map(f => row[f]).join('|||');
          if (compositeUniqueMap.get(valStr)!.length > 1) {
            const headers = this.compositeUniqueFields!.map(f => this.columns.find(c => c.field === f)?.header).join(' and ');
            const errStr = `Duplicate combination of ${headers} found in the sheet.`;
            if (!errors.includes(errStr)) {
              errors.push(errStr);
              this.compositeUniqueFields!.forEach(f => {
                if (!errorMap[f]) errorMap[f] = errStr;
              });
            }
          }
        }
      }

      row['_errors'] = errors;
      row['_errorMap'] = errorMap;

      errors.forEach((err: string) => {
        this.columns.forEach(col => {
          if (err.toLowerCase().includes(col.header.toLowerCase())) {
            row['_errorMap'][col.field] = err;
          }
        });
      });
    });
  }

  deleteRow(index: number) {
    this.mappedData.splice(index, 1);
  }

  downloadTemplate() {
    const header = this.columns.map(c => c.header);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([header]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${this.title.replace(/\s+/g, '_')}_Template.xlsx`);
  }

  submit() {
    if (!this.importFn) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Import function not configured.' });
      return;
    }

    this.validateAll();
    const hasValidationErrors = this.mappedData.some(row => row['_errors']?.length > 0);
    if (hasValidationErrors) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fix validation errors before submitting.' });
      return;
    }

    if (this.mappedData.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data to import.' });
      return;
    }

    const finalData = this.mappedData.map(row => {
      const { _tempId, _errors, _errorMap, ...cleanRow } = row;
      return cleanRow;
    });

    this.isSubmitting = true;
    this.importSub = this.importFn(finalData).subscribe({
      next: (importResult: ImportResult) => {
        this.isSubmitting = false;
        const hasErrors = (importResult?.errors?.length ?? 0) > 0;
        const hasWarnings = (importResult?.warnings?.length ?? 0) > 0;

        if (hasErrors || hasWarnings) {
          this.dialogService.open(ImportResultDialogComponent, {
            header: 'Import Result',
            width: '50vw',
            maximizable: true,
            data: { result: importResult }
          });
        }

        if (hasErrors) {
          // Keep wizard open so user sees the errors
          return;
        }

        if ((importResult?.successCount ?? 0) > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${importResult.successCount} ${this.successLabel} imported successfully`
          });
        }

        this.onImportSuccess?.();
        this.hideDialog();
      },
      error: () => {
        this.isSubmitting = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to import ${this.successLabel}.` });
      }
    });
  }
}
