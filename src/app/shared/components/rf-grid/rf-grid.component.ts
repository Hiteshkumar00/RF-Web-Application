import { Component, EventEmitter, Input, Output, ContentChildren, QueryList, AfterContentInit, TemplateRef, ViewChild, inject, OnInit, OnDestroy } from '@angular/core';
import { TableLazyLoadEvent, Table } from 'primeng/table';
import { PrimeTemplate, MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { ExcelService } from '../../services/excel.service';

export interface GridAction {
  icon: string;
  tooltip: string;
  severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;
  onClick: (item: any) => void;
}

export interface ColumnDef {
  field: string;
  header: string;
  type?: 'text' | 'numeric' | 'boolean' | 'date' | 'image' | 'action' | 'custom';
  matchMode?: string;
  sortable?: boolean;
  width?: string;
  actions?: GridAction[]; // Used when type is 'action'
  imageFallbackIcon?: string; // Used when type is 'image'
  prefix?: string; // Useful for things like '#' before ID
  exportable?: boolean; // Set to false to exclude from export
}

export interface GridConfig {
  data: any[];
  columns: ColumnDef[];
  totalRecords: number;
  loading: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];
  globalSearchTerm?: string;
  selection?: any[];
  enableSelection?: boolean;
  
  // Advanced table options
  lazy?: boolean;
  paginator?: boolean;
  showCurrentPageReport?: boolean;
  currentPageReportTemplate?: string;
  globalFilterFields?: string[];
  
  resizableColumns?: boolean;
  columnResizeMode?: 'fit' | 'expand';
  scrollable?: boolean;
  scrollHeight?: string;
  styleClass?: string;
  
  // Card Header / Toolbar Options
  title?: string;
  showAddButton?: boolean;
  addButtonTooltip?: string;
  onAdd?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showExport?: boolean;
  exportFilename?: string; // Prefix for export file
  dataFetcher?: (event: TableLazyLoadEvent) => Observable<{ data: any[], totalRecords: number }>; // Unified fetcher
  reloadEvent?: EventEmitter<void>;
  showLoader?: boolean;
}

@Component({
  selector: 'app-rf-grid',
  standalone: false,
  templateUrl: './rf-grid.component.html',
  styleUrls: ['./rf-grid.component.scss']
})
export class RfGridComponent implements AfterContentInit, OnInit, OnDestroy {
  @Input() config!: GridConfig;
  
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();
  
  @ViewChild('dt') dt!: Table;
  
  private excelService = inject(ExcelService);
  
  exportMenuItems: MenuItem[] = [];
  private lastLazyLoadEvent?: TableLazyLoadEvent;
  private reloadSubscription?: Subscription;
  
  // Custom templates
  @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;
  bodyTemplate: TemplateRef<any> | null = null;
  headerTemplate: TemplateRef<any> | null = null;
  toolbarStartTemplate: TemplateRef<any> | null = null;
  toolbarEndTemplate: TemplateRef<any> | null = null;

  ngOnInit() {
      this.updateExportMenu();
      if (this.config && this.config.reloadEvent) {
          this.reloadSubscription = this.config.reloadEvent.subscribe(() => {
              this.reload();
          });
      }
  }

  ngOnDestroy() {
      if (this.reloadSubscription) {
          this.reloadSubscription.unsubscribe();
      }
  }

  ngAfterContentInit() {
      this.templates.forEach((item) => {
          switch (item.getType()) {
              case 'body':
                  this.bodyTemplate = item.template;
                  break;
              case 'header':
                  this.headerTemplate = item.template;
                  break;
              case 'toolbarStart':
                  this.toolbarStartTemplate = item.template;
                  break;
              case 'toolbarEnd':
                  this.toolbarEndTemplate = item.template;
                  break;
          }
      });
  }

  onGlobalSearch(term: string) {
    if (this.config) {
      this.config.globalSearchTerm = term;
      if (this.dt) {
         // This triggers the onLazyLoad event with the new global filter
         this.dt.filterGlobal(term, 'contains');
      }
    }
  }

  loadData(event: TableLazyLoadEvent) {
    if (this.config && this.config.globalSearchTerm) {
        event.filters = event.filters || {};
        event.filters['global'] = [{ value: this.config.globalSearchTerm, matchMode: 'contains' }];
    }
    
    this.lastLazyLoadEvent = event;

    if (this.config && this.config.dataFetcher) {
        this.config.loading = true;
        this.config.dataFetcher(event).subscribe({
            next: (res) => {
                this.config.data = res.data;
                this.config.totalRecords = res.totalRecords;
                this.config.loading = false;
            },
            error: () => {
                this.config.loading = false;
            }
        });
    } else {
        this.onLazyLoad.emit(event);
    }
  }

  public reload() {
    if (this.lastLazyLoadEvent) {
        this.loadData(this.lastLazyLoadEvent);
    }
  }

  onSelectionChange(event: any) {
    this.selectionChange.emit(this.config.selection);
    this.updateExportMenu();
  }

  updateExportMenu() {
      this.exportMenuItems = [
          {
              label: 'Export Selected',
              icon: 'pi pi-check-square',
              badge: (this.config.selection && this.config.selection.length > 0) ? this.config.selection.length.toString() : undefined,
              badgeStyleClass: 'p-badge-success',
              command: () => this.exportData(true),
              disabled: !this.config.selection || this.config.selection.length === 0
          },
          { 
              label: 'Export All', 
              icon: 'pi pi-copy', 
              command: () => this.exportData(false) 
          }
      ];
  }

  exportData(onlySelected: boolean) {
      if (onlySelected) {
          this.executeExport(this.config.selection || [], true);
      } else {
          if (this.config.dataFetcher && this.lastLazyLoadEvent) {
              this.config.loading = true;
              // Ask for all records matching current filters by disabling pagination (rows: -1)
              const exportEvent: TableLazyLoadEvent = { ...this.lastLazyLoadEvent, first: 0, rows: -1 };
              this.config.dataFetcher(exportEvent).subscribe({
                  next: (res) => {
                      this.executeExport(res.data, false);
                      this.config.loading = false;
                  },
                  error: () => {
                      this.config.loading = false;
                  }
              });
          } else {
              // Fallback to current page if no fetcher provided
              this.executeExport(this.config.data, false);
          }
      }
  }

  private executeExport(data: any[], onlySelected: boolean) {
      if (!data || data.length === 0) return;
      
      const exportableColumns = this.config.columns.filter(c => c.exportable !== false && c.type !== 'action' && c.type !== 'image');
      
      const formattedData = data.map(item => {
          const row: any = {};
          exportableColumns.forEach(col => {
              row[col.header] = item[col.field] ?? '-';
          });
          return row;
      });

      const prefix = this.config.exportFilename || this.config.title || 'Export';
      const filename = onlySelected ? `${prefix}_Selected` : `${prefix}_All`;
      this.excelService.exportAsExcelFile(formattedData, filename);
  }
}
