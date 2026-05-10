import { Component, OnInit, inject } from '@angular/core';
import { ProductApiService } from '../../services/product-api.service';
import { ProductDto, ProductFilterDto } from '../../models/product.dto';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GlobalConfigService } from '../../../../core/services/global-config.service';

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

  products: ProductDto[] = [];
  filter: ProductFilterDto = { searchTerm: '' };
  loading: boolean = false;
  
  // Dialog controls
  showFormDialog = false;
  formDialogMode: 'create' | 'update' | 'view' = 'create';
  selectedId?: number;


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productApiService.getAll(this.filter).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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
