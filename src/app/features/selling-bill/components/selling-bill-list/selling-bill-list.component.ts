import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { StatisticCard } from '../../../../shared/models/statistic-card.model';

import { SellingBillDialogService } from '../../services/selling-bill-dialog.service';
import { ActivatedRoute } from '@angular/router';

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
        public accountDetailsService: AccountDetailsService,
        private whatsAppService: WhatsAppService,
        private emailService: EmailService,
        private route: ActivatedRoute,
        private sellingBillDialogService: SellingBillDialogService
    ) {}

    title = SellingBillConstants.SELLING_BILL_TITLE;
    labels = SellingBillConstants.LABELS;
    bills: SellingBillListDto[] = [];
    selectedBills: SellingBillListDto[] = [];
    exportMenuItems: MenuItem[] = [];
    sendMessageMenuItems: MenuItem[] = [];

    @Input() isDialog: boolean = false;
    @Input() visible: boolean = false;
    @Input() customerId?: number;
    @Output() closeDialog = new EventEmitter<void>();

    openPaymentDialog(item: SellingBillListDto): void {
        this.sellingBillDialogService.openPayment(item, () => this.onPaymentSaved(), () => {});
    }

    onPaymentSaved(): void {
        this.loadData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payments updated successfully' });
    }

    get canSendWhatsApp(): boolean {
        return this.accountDetailsService.enableWhatsApp;
    }

    get canSendEmail(): boolean {
        return this.accountDetailsService.enableEmail;
    }

    // Summary totals
    get totalSellingAmount(): number {
        return this.bills.reduce((sum, b) => sum + (b.netAmount || 0), 0);
    }

    get totalReceivedAmount(): number {
        return this.bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    }

    get totalRemainingAmount(): number {
        return this.bills.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
    }

    get statisticCards(): StatisticCard[] {
        return [
            { title: 'Total Sales', amount: this.totalSellingAmount, colorClass: 'info', icon: 'pi-chart-line' },
            { title: 'Total Received', amount: this.totalReceivedAmount, colorClass: 'success', icon: 'pi-check-circle' },
            { title: 'Remaining Balance', amount: this.totalRemainingAmount, colorClass: '', icon: 'pi-clock', isRemaining: true }
        ];
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            if (data['data']) {
                this.bills = data['data'];
            } else {
                this.loadData();
            }
        });
        this.updateExportMenu();
        this.updateSendMessageMenu();
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
        this.updateSendMessageMenu();
    }

    public updateSendMessageMenu(): void {
        this.sendMessageMenuItems = [
            {
                label: 'Send WhatsApp',
                icon: 'pi pi-whatsapp',
                badge: this.selectedBills.length > 0 ? this.selectedBills.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.sendMessagesToSelected('whatsapp'),
                disabled: this.selectedBills.length === 0,
                visible: this.canSendWhatsApp
            },
            {
                label: 'Send Email',
                icon: 'pi pi-envelope',
                badge: this.selectedBills.length > 0 ? this.selectedBills.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.sendMessagesToSelected('email'),
                disabled: this.selectedBills.length === 0,
                visible: this.canSendEmail
            }
        ];
    }

    public sendMessagesToSelected(type: 'whatsapp' | 'email'): void {
        if (this.selectedBills.length === 0) return;

        const billIds = this.selectedBills.map(b => b.id);
        const actionName = type === 'whatsapp' ? 'WhatsApp messages' : 'Emails';

        this.confirmationService.confirm({
            message: `Are you sure you want to send ${actionName} for ${billIds.length} selected bills?`,
            header: 'Confirm Sending',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (type === 'whatsapp') {
                    this.apiService.bulkSendWhatsAppMessages(billIds).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `Successfully sent WhatsApp messages for ${billIds.length} bills.`
                            });
                        },
                        error: (err) => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send some WhatsApp messages.' });
                        }
                    });
                } else if (type === 'email') {
                    this.apiService.bulkSendEmailMessages(billIds).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `Successfully sent Emails for ${billIds.length} bills.`
                            });
                        },
                        error: (err) => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send some Emails.' });
                        }
                    });
                }
            }
        });
    }

    loadData(): void {
        if (this.customerId) {
            this.apiService.getByCustomerId(this.customerId).subscribe({
                next: (data) => {
                    this.bills = data ?? [];
                    this.updateExportMenu();
                }
            });
        } else {
            this.apiService.getAll().subscribe({
                next: (data) => {
                    this.bills = data ?? [];
                    this.updateExportMenu();
                }
            });
        }
    }

    openCreateDialog(): void {
        this.sellingBillDialogService.openForm('create', undefined, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
    }

    openEditDialog(item: SellingBillListDto): void {
        this.sellingBillDialogService.openForm('update', item.id, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
    }

    openViewDialog(item: SellingBillListDto): void {
        this.sellingBillDialogService.openForm('view', item.id, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
    }

    onFormSaved(mode: 'create' | 'update' | 'view'): void {
        this.loadData();
        if (mode !== 'view') {
            const msg = mode === 'create'
                ? SellingBillConstants.MESSAGES.CREATE_SUCCESS(this.title)
                : SellingBillConstants.MESSAGES.UPDATE_SUCCESS(this.title);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        }
    }

    onFormDialogClosed(): void {
    }

    onHideDialog(): void {
        this.closeDialog.emit();
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
        this.confirmationService.confirm({
            header: 'Confirm Sending',
            message: `Are you sure you want to send a WhatsApp message to ${item.customerName}?`,
            icon: 'pi pi-whatsapp',
            accept: () => {
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
        });
    }

    sendEmail(bill: SellingBillListDto): void {
        this.confirmationService.confirm({
            header: 'Confirm Sending',
            message: `Are you sure you want to send an Email to ${bill.customerName}?`,
            icon: 'pi pi-envelope',
            accept: () => {
                this.emailService.sendBillOnEmail(bill);
            }
        });
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedBills : this.bills;

        const data = source.map(item => ({
            'ID': item.id,
            [this.labels.BILL_NO]: item.billNo || '-',
            'Cust ID': item.customerId || '-',
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
