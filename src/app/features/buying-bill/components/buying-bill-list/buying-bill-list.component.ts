import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { BuyingBillApiService } from '../../services/buying-bill-api.service';
import { BuyingBillListDto } from '../../models/buying-bill-list.dto';
import { BuyingBillConstants } from '../../constants/buying-bill.constants';
import { BillDownloadService } from '../../../../shared/services/bill-download.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { StatisticCard } from '../../../../shared/models/statistic-card.model';

@Component({
    selector: 'app-buying-bill-list',
    standalone: false,
    templateUrl: './buying-bill-list.component.html'
})
export class BuyingBillListComponent implements OnInit {
    constructor(
        private apiService: BuyingBillApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private downloadService: BillDownloadService,
        public globalConfig: GlobalConfigService,
        private excelService: ExcelService,
        private helperService: HelperService,
        public accountDetailsService: AccountDetailsService
    ) {}

    title = BuyingBillConstants.BUYING_BILL_TITLE;
    labels = BuyingBillConstants.LABELS;
    bills: BuyingBillListDto[] = [];
    selectedBills: BuyingBillListDto[] = [];
    exportMenuItems: MenuItem[] = [];

    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedId?: number;

    // Summary totals
    get totalBuyingAmount(): number {
        return this.bills.reduce((sum, b) => sum + (b.finalAmount || 0), 0);
    }

    get statisticCards(): StatisticCard[] {
        return [
            { title: 'Total Purchases', amount: this.totalBuyingAmount, colorClass: 'info', icon: 'pi-shopping-cart' }
        ];
    }

    ngOnInit(): void {
        this.loadData();
        this.updateExportMenu();
    }

    public updateExportMenu(): void {
        this.exportMenuItems = [
            { 
                label: 'Export Selected', 
                icon: 'pi pi-check-square', 
                badge: this.selectedBills.length > 0 ? this.selectedBills.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedBills.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => {
                this.bills = data ?? [];
                this.updateExportMenu();
            }
        });
    }

    openCreateDialog(): void {
        this.selectedId = undefined;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(item: BuyingBillListDto): void {
        this.selectedId = item.id;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(item: BuyingBillListDto): void {
        this.selectedId = item.id;
        this.formDialogMode = 'view';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadData();
        const msg = this.formDialogMode === 'create'
            ? BuyingBillConstants.MESSAGES.CREATE_SUCCESS(this.title)
            : BuyingBillConstants.MESSAGES.UPDATE_SUCCESS(this.title);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }



    confirmDelete(item: BuyingBillListDto): void {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: BuyingBillConstants.MESSAGES.DELETE_CONFIRM(this.title),
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
            next: () => {
                this.loadData();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: BuyingBillConstants.MESSAGES.DELETE_SUCCESS(this.title)
                });
            }
        });
    }

    downloadPdf(item: BuyingBillListDto): void {
        this.apiService.downloadInvoice(item.id).subscribe({
            next: (blob) => {
                const dateStr = item.date.split('-').reverse().join('-');
                const fileName = `Purchase_Bill_${item.billNo || item.id}_${dateStr}.pdf`;
                this.downloadService.downloadFile(blob, fileName);
            }
        });
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedBills : this.bills;

        const data = source.map(item => ({
            'ID': item.id,
            [this.labels.BILL_NO]: item.billNo || '-',
            [this.labels.AGENCY]: item.agencyName,
            [this.labels.DATE]: this.helperService.formatDate(item.date),
            [this.labels.TOTAL_AMOUNT]: item.totalAmount,
            [this.labels.DISCOUNT]: item.discount,
            [this.labels.NET_AMOUNT]: item.netAmount,
            [this.labels.TOTAL_EXPENCE]: item.totalExpence,
            [this.labels.FINAL_AMOUNT]: item.finalAmount
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Buying_Bills_Selected' : 'Buying_Bills');
    }
}
