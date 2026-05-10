import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { SellingBillApiService } from '../../services/selling-bill-api.service';
import { SellingBillListDto } from '../../models/selling-bill.model';
import { SellingBillConstants } from '../../constants/selling-bill.constants';
import { BillDownloadService } from '../../../../shared/services/bill-download.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { WhatsAppService } from '../../../../shared/services/whatsapp.service';
import { EmailService } from '../../../../shared/services/email.service';

@Component({
    selector: 'app-selling-bill-list',
    standalone: false,
    templateUrl: './selling-bill-list.component.html'
})
export class SellingBillListComponent implements OnInit {
    constructor(
        private apiService: SellingBillApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private downloadService: BillDownloadService,
        public globalConfig: GlobalConfigService,
        private excelService: ExcelService,
        private helperService: HelperService,
        private accountDetailsService: AccountDetailsService,
        private whatsAppService: WhatsAppService,
        private emailService: EmailService
    ) {}

    title = SellingBillConstants.SELLING_BILL_TITLE;
    labels = SellingBillConstants.LABELS;
    bills: SellingBillListDto[] = [];
    selectedBills: SellingBillListDto[] = [];
    exportMenuItems: MenuItem[] = [];

    showFormDialog = false;
    showPaymentDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedId?: number;
    selectedBill?: SellingBillListDto;

    openPaymentDialog(item: SellingBillListDto): void {
        this.selectedBill = item;
        this.showPaymentDialog = true;
    }

    onPaymentSaved(): void {
        this.showPaymentDialog = false;
        this.loadData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payments updated successfully' });
    }

    get canSendWhatsApp(): boolean {
        return this.accountDetailsService.enableWhatsApp;
    }

    get canSendEmail(): boolean {
        return this.accountDetailsService.enableEmail;
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

    openEditDialog(item: SellingBillListDto): void {
        this.selectedId = item.id;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(item: SellingBillListDto): void {
        this.selectedId = item.id;
        this.formDialogMode = 'view';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadData();
        const msg = this.formDialogMode === 'create'
            ? SellingBillConstants.MESSAGES.CREATE_SUCCESS(this.title)
            : SellingBillConstants.MESSAGES.UPDATE_SUCCESS(this.title);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(item: SellingBillListDto): void {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: SellingBillConstants.MESSAGES.DELETE_CONFIRM(this.title),
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
                    detail: SellingBillConstants.MESSAGES.DELETE_SUCCESS(this.title)
                });
            }
        });
    }

    downloadPdf(item: SellingBillListDto): void {
        this.apiService.downloadInvoice(item.id).subscribe({
            next: (blob) => {
                const fileName = `Bill_${item.billNo || item.id}_${item.date}_${item.customerName}.pdf`;
                this.downloadService.downloadFile(blob, fileName);
            }
        });
    }

    sendWhatsApp(item: SellingBillListDto): void {
        this.apiService.downloadInvoice(item.id).subscribe({
            next: (blob) => {
                const fileName = `Bill_${item.billNo}_${item.date}_${item.customerName}.pdf`;
                this.whatsAppService.sendBillOnWhatsApp(item, blob, fileName);
            },
            error: () => {
                this.whatsAppService.sendBillOnWhatsApp(item);
            }
        });
    }

    sendEmail(bill: SellingBillListDto): void {
        this.emailService.sendBillOnEmail(bill);
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedBills : this.bills;

        const data = source.map(item => ({
            'ID': item.id,
            [this.labels.BILL_NO]: item.billNo || '-',
            [this.labels.CUSTOMER_NAME]: item.customerName,
            [this.labels.PHONE_NO]: item.phoneNo,
            [this.labels.DATE]: this.helperService.formatDate(item.date),
            [this.labels.TOTAL_AMOUNT]: item.totalAmount,
            [this.labels.DISCOUNT]: item.discount,
            [this.labels.NET_AMOUNT]: item.netAmount,
            [this.labels.PAID_AMOUNT]: item.paidAmount,
            [this.labels.REMAINING_AMOUNT]: item.remainingAmount
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Selling_Bills_Selected' : 'Selling_Bills');
    }
}
