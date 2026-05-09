import { Injectable, inject } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private messageService = inject(MessageService);

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    if (!json || json.length === 0) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'No Data', 
        detail: 'No records found to export' 
      });
      return;
    }

    try {
      // Create worksheet from JSON
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      
      // Auto-filter for all columns
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

      // Set dynamic column widths
      const colWidths = this.calculateColumnWidths(json);
      worksheet['!cols'] = colWidths.map(w => ({ wch: w }));

      /**
       * NOTE: Bold headers and background colors require 'xlsx-js-style' or 'xlsx-style'.
       * The community 'xlsx' library does not support cell styling.
       * Below is a structure that prepares the headers if a styling-compatible library is used.
       */
      const headerRange = { s: { r: 0, c: 0 }, e: { r: 0, c: range.e.c } };
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!worksheet[address]) continue;
        
        // Define style (supported by xlsx-js-style)
        worksheet[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } }, // Professional Blue
          alignment: { horizontal: "center" }
        };
      }

      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      this.saveAsExcelFile(excelBuffer, excelFileName);
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Data exported successfully' 
      });
    } catch (error) {
      console.error('Excel Export Error:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Export Failed', 
        detail: 'An error occurred during export' 
      });
    }
  }

  private calculateColumnWidths(json: any[]): number[] {
    if (!json || json.length === 0) return [];
    
    const keys = Object.keys(json[0]);
    return keys.map(key => {
      const maxLen = json.reduce((max, item) => {
        const val = item[key] ? String(item[key]).length : 0;
        return Math.max(max, val);
      }, key.length);
      // Min 12, Max 50, +4 for padding
      return Math.min(Math.max(maxLen + 4, 12), 50);
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    const timestamp = new Date().getTime();
    FileSaver.saveAs(data, `${fileName}_${timestamp}${this.fileExtension}`);
  }
}
