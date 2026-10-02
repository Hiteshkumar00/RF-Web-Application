import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

export interface ImportRowMessage {
  rowNo: number;
  message: string;
}

export interface ImportResult {
  successCount: number;
  warnings: ImportRowMessage[];
  errors: ImportRowMessage[];
}

@Component({
  selector: 'app-import-result-dialog',
  standalone: false,
  templateUrl: './import-result-dialog.component.html'
})
export class ImportResultDialogComponent implements OnInit {
  result: ImportResult = { successCount: 0, warnings: [], errors: [] };

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    if (this.config.data && this.config.data.result) {
        this.result = this.config.data.result;
    }
  }

  close() {
    this.ref.close();
  }
}
