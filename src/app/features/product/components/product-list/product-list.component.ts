import { Component, OnInit, inject } from '@angular/core';
import { ProductApiService } from '../../services/product-api.service';
import { ProductDto, ProductFilterDto } from '../../models/product.dto';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDialogService } from '../../services/product-dialog.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productApiService = inject(ProductApiService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public globalConfig = inject(GlobalConfigService);
  private excelService = inject(ExcelService);
  private route = inject(ActivatedRoute);
  private productDialogService = inject(ProductDialogService);

  products: ProductDto[] = [];
  selectedProducts: ProductDto[] = [];
  exportMenuItems: MenuItem[] = [];
  filter: ProductFilterDto = { searchTerm: '' };
  loading: boolean = false;
  
  // Dialog controls
  showFormDialog = false;
  formDialogMode: 'create' | 'update' | 'view' = 'create';
  selectedId?: number;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['data']) {
        this.products = data['data'];
      } else {
        this.loadProducts();
      }
    });
    this.updateExportMenu();
  }

  loadProducts(): void {
    this.loading = true;
    this.productApiService.getAll(this.filter).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.updateExportMenu();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateExportMenu(): void {
    this.exportMenuItems = [
      {
        label: 'Export Selected',
        icon: 'pi pi-check-square',
        badge: this.selectedProducts.length > 0 ? this.selectedProducts.length.toString() : undefined,
        badgeStyleClass: 'p-badge-success',
        command: () => this.exportToExcel(true),
        disabled: this.selectedProducts.length === 0
      },
      { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
    ];
  }

  exportToExcel(onlySelected: boolean = false): void {
    const source = onlySelected ? this.selectedProducts : this.products;

    const data = source.map(item => ({
      'Product ID': item.id,
      'Product Name': item.productName,
      'Warranty (Years)': item.warrantyYear || 0,
      'Warranty (Months)': item.warrantyMonth || 0,
      'Warranty (Days)': item.warrantyDay || 0,
      'Image URL': item.imageLink || '-'
    }));
    this.excelService.exportAsExcelFile(data, onlySelected ? 'Products_Selected' : 'Products');
  }

  onSearch(): void {
    this.loadProducts();
  }

  openCreateDialog(): void {
    this.formDialogMode = 'create';
    this.selectedId = undefined;
    this.showFormDialog = true;
  }

  openEditDialog(product: ProductDto): void {
    this.formDialogMode = 'update';
    this.selectedId = product.id;
    this.showFormDialog = true;
  }

  openViewDialog(product: ProductDto): void {
    this.formDialogMode = 'view';
    this.selectedId = product.id;
    this.showFormDialog = true;
  }


  onFormSaved(): void {
    this.loadProducts();
  }

  onFormDialogClosed(): void {
    this.showFormDialog = false;
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
                this.loadProducts();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted' });
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
