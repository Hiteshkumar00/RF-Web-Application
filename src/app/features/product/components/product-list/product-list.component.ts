import { Component, OnInit, inject, EventEmitter } from '@angular/core';
import { ProductApiService } from '../../services/product-api.service';
import { ProductDto, ProductFilterDto } from '../../models/product.dto';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { ProductDialogService } from '../../services/product-dialog.service';
import { ProductImportExportService } from '../../services/product-import-export.service';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { RfGridComponent, GridConfig } from '../../../../shared/components/rf-grid/rf-grid.component';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  public accountDetails = inject(AccountDetailsService);
  private productApiService = inject(ProductApiService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public globalConfig = inject(GlobalConfigService);
  private excelService = inject(ExcelService);
  private route = inject(ActivatedRoute);
  private productDialogService = inject(ProductDialogService);

  reloadGrid = new EventEmitter<void>();

  importMenuItems: MenuItem[] = [];

  gridConfig: GridConfig | any = {
    reloadEvent: this.reloadGrid,
    data: [],
    totalRecords: 0,
    loading: false,
    showLoader: false,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50],
    globalSearchTerm: '',
    enableSelection: true,
    selection: [],
    scrollable: true,
    scrollHeight: 'calc(100vh - 235px)',
    resizableColumns: true,
    columnResizeMode: 'expand',
    styleClass: 'p-datatable-sm p-datatable-striped p-datatable-gridlines',
    title: 'Product Management',
    showAddButton: true,
    addButtonTooltip: 'New Product',
    onAdd: () => this.openCreateDialog(),
    showSearch: true,
    searchPlaceholder: 'Search products...',
    showExport: false, // will be set in ngOnInit
    exportFilename: 'Products',
    dataFetcher: (event: TableLazyLoadEvent) => this.productApiService.getAll(event),
    columns: [
      { field: 'id', header: 'ID', sortable: true, width: '80px', prefix: '#' },
      {
        field: 'actions',
        header: 'Action',
        type: 'action',
        width: '120px',
        exportable: false,
        actions: [
          { icon: 'pi pi-eye', tooltip: 'View Details', severity: 'secondary', onClick: (item: any) => this.openViewDialog(item) },
          { icon: 'pi pi-pencil', tooltip: 'Edit', severity: 'primary', onClick: (item: any) => this.openEditDialog(item) },
          { icon: 'pi pi-trash', tooltip: 'Delete', severity: 'danger', onClick: (item: any) => this.deleteProduct(item) }
        ]
      },
      { field: 'productName', header: 'Product Name', sortable: true, type: 'text' },
      { field: 'warrantyYear', header: 'Warranty (Years)', type: 'numeric' },
      { field: 'warrantyMonth', header: 'Warranty (Months)', type: 'numeric' },
      { field: 'warrantyDay', header: 'Warranty (Days)', type: 'numeric' },
      { field: 'imageLink', header: 'Image URL', type: 'image', width: '100px', imageFallbackIcon: 'pi pi-image', exportable: false }
    ]
  };

  ngOnInit(): void {
    // The grid automatically triggers its first load using the dataFetcher.
    this.gridConfig.showExport = this.accountDetails.enableMigration;
    this.importMenuItems = [
      { label: 'Export for Import', icon: 'pi pi-download', command: () => this.exportForImport() }
    ];
  }

  private importExportService = inject(ProductImportExportService);

  exportForImport(): void {
    this.importExportService.exportForImport();
  }

  openImportWizard(): void {
    // Reload logic for import wizard might need to trigger grid reload manually
    this.importExportService.openImportWizard(() => {
      this.reloadGrid.emit();
    });
  }

  openCreateDialog(): void {
    this.productDialogService.openForm('create', undefined, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
  }

  openEditDialog(product: ProductDto): void {
    this.productDialogService.openForm('update', product.id, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
  }

  openViewDialog(product: ProductDto): void {
    this.productDialogService.openForm('view', product.id, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
  }


  onFormSaved(mode: 'create' | 'update' | 'view'): void {
    this.reloadGrid.emit();
  }

  onFormDialogClosed(): void {
  }

  deleteProduct(product: ProductDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${product.productName}? This will fail if the product is linked to existing bills.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productApiService.delete(product.id).subscribe({
          next: (res: any) => {
            if (res !== null) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted' });
              this.reloadGrid.emit();
            }
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
          }
        });
      }
    });
  }
}
