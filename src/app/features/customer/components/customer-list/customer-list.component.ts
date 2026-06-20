import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerApiService } from '../../services/customer-api.service';
import { CustomerListDto } from '../../models/customer.model';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { StatisticCard } from '../../../../shared/models/statistic-card.model';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
  customers: CustomerListDto[] = [];
  selectedCustomers: CustomerListDto[] = [];
  
  showFormDialog = false;
  formDialogMode: 'create' | 'update' | 'view' = 'create';
  selectedId?: number;

  constructor(
    private apiService: CustomerApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public globalConfig: GlobalConfigService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.customers = data ?? [];
      }
    });
  }

  // Summary totals
  get totalCustomers(): number {
    return this.customers.length;
  }

  get totalPurchasingAmount(): number {
    return this.customers.reduce((sum, c) => sum + (c.totalNetAmount || 0), 0);
  }

  get totalRemainingAmount(): number {
    return this.customers.reduce((sum, c) => sum + (c.totalRemainingAmount || 0), 0);
  }

  get statisticCards(): StatisticCard[] {
    return [
      { title: 'Total Customers', amount: this.totalCustomers, colorClass: 'info', icon: 'pi-users', isNumberOnly: true },
      { title: 'Total Sales Dues', amount: this.totalRemainingAmount, colorClass: 'danger', icon: 'pi-clock', isRemaining: true },
      { title: 'Total Purchasing', amount: this.totalPurchasingAmount, colorClass: 'success', icon: 'pi-shopping-bag' }
    ];
  }

  openCreateDialog(): void {
    this.selectedId = undefined;
    this.formDialogMode = 'create';
    this.showFormDialog = true;
  }

  openEditDialog(item: CustomerListDto): void {
    this.selectedId = item.id;
    this.formDialogMode = 'update';
    this.showFormDialog = true;
  }

  openViewDialog(item: CustomerListDto): void {
    this.selectedId = item.id;
    this.formDialogMode = 'view';
    this.showFormDialog = true;
  }

  confirmDelete(item: CustomerListDto): void {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: `Are you sure you want to delete customer '${item.customerName}'?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.deleteItem(item.id)
    });
  }

  private deleteItem(id: number): void {
    this.apiService.delete(id).subscribe({
      next: (res) => {
        if (res) {
          this.loadData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully' });
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Cannot delete customer with existing bills.' });
      }
    });
  }

  onFormSaved(): void {
    this.showFormDialog = false;
    this.loadData();
    const msg = this.formDialogMode === 'create' ? 'Customer created successfully' : 'Customer updated successfully';
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  onFormDialogClosed(): void {
    this.showFormDialog = false;
  }
}
