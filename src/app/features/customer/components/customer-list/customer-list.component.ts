import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { CustomerApiService } from '../../services/customer-api.service';
import { CustomerListDto } from '../../models/customer.model';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { StatisticCard } from '../../../../shared/models/statistic-card.model';
import { ExcelService } from '../../../../shared/services/excel.service';

import { CustomerDialogService } from '../../services/customer-dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
  customers: CustomerListDto[] = [];
  selectedCustomers: CustomerListDto[] = [];
  exportMenuItems: MenuItem[] = [];

  constructor(
    private apiService: CustomerApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public globalConfig: GlobalConfigService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private customerDialogService: CustomerDialogService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['data']) {
        this.customers = data['data'];
        this.updateExportMenu();
      } else {
        this.loadData();
      }
    });
  }

  public updateExportMenu(): void {
    this.exportMenuItems = [
      {
        label: 'Export Selected',
        icon: 'pi pi-check-square',
        badge: this.selectedCustomers.length > 0 ? this.selectedCustomers.length.toString() : undefined,
        badgeStyleClass: 'p-badge-success',
        command: () => this.exportToExcel(true),
        disabled: this.selectedCustomers.length === 0
      },
      { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
    ];
  }

  loadData(): void {
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.customers = data ?? [];
        this.updateExportMenu();
      }
    });
  }

  exportToExcel(onlySelected: boolean = false): void {
    const source = onlySelected ? this.selectedCustomers : this.customers;

    const data = source.map(item => ({
      'Customer ID': item.id,
      'Customer Name': item.customerName,
      'Phone No': item.phoneNo || '-',
      'Email': item.email || '-',
      'Address': item.address || '-',
      'Bills Count': item.totalPurchases || 0,
      'Total Purchasing': item.totalNetAmount || 0,
      'Total Remaining': item.totalRemainingAmount || 0
    }));
    this.excelService.exportAsExcelFile(data, onlySelected ? 'Customers_Selected' : 'Customers');
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
      { title: 'Total Remaining', amount: this.totalRemainingAmount, colorClass: 'danger', icon: 'pi-clock', isRemaining: true },
      { title: 'Total Purchasing', amount: this.totalPurchasingAmount, colorClass: 'success', icon: 'pi-shopping-bag' }
    ];
  }

  openCreateDialog(): void {
    this.customerDialogService.openForm('create', undefined, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
  }

  openEditDialog(item: CustomerListDto): void {
    this.customerDialogService.openForm('update', item.id, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
  }

  openViewDialog(item: CustomerListDto): void {
    this.customerDialogService.openForm('view', item.id, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
  }

  openSellingBills(item: CustomerListDto): void {
    this.customerDialogService.openSellingBills(item.id, item.customerName);
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

  onFormSaved(mode: 'create' | 'update' | 'view'): void {
    this.loadData();
    if (mode !== 'view') {
      const msg = mode === 'create' ? 'Customer created successfully' : 'Customer updated successfully';
      this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }
  }

  onFormDialogClosed(): void {
  }
}
