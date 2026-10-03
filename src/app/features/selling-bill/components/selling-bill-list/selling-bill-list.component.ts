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
import { TableLazyLoadEvent } from 'primeng/table';
import { map } from 'rxjs/operators';
import { GridConfig } from '../../../../shared/components/rf-grid/rf-grid.component';

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
        public accountDetails: AccountDetailsService,
        private whatsAppService: WhatsAppService,
        private emailService: EmailService,
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

    reloadGrid = new EventEmitter<void>();

    gridConfig: GridConfig | any = {
        reloadEvent: this.reloadGrid,
        data: [],
        totalRecords: 0,
        loading: false,
        showLoader: true,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50],
        globalSearchTerm: '',
        enableSelection: true,
        selection: this.selectedBills,
        scrollable: true,
        scrollHeight: 'calc(100vh - 235px)',
        resizableColumns: true,
        columnResizeMode: 'expand',
        styleClass: 'p-datatable-sm p-datatable-striped p-datatable-gridlines',
        title: this.title,
        showAddButton: false, // Will set based on !isDialog
        onAdd: () => this.openCreateDialog(),
        showSearch: true,
        showExport: false, // Will set based on accountDetails
        dataFetcher: (event: TableLazyLoadEvent) => {
            return this.apiService.getAll(event, this.customerId).pipe(
                map(res => {
                    this.bills = res.data;
                    return res;
                })
            );
        },
        columns: [
            { field: 'id', header: 'ID', sortable: true, type: 'numeric', width: '90px', prefix: '#', cellClass: 'fw-bold text-muted small' },
            { field: 'actions', header: 'Action', type: 'action', width: '200px', exportable: false, actions: [
                { icon: 'pi pi-eye', tooltip: 'View', severity: 'secondary', onClick: (item: any) => this.openViewDialog(item) },
                { icon: 'pi pi-whatsapp', tooltip: 'Send on WhatsApp', severity: 'success', visible: () => this.canSendWhatsApp, onClick: (item: any) => this.sendWhatsApp(item) },
                { icon: 'pi pi-envelope', tooltip: 'Send on Email', severity: 'help', visible: () => this.canSendEmail, onClick: (item: any) => this.sendEmail(item) },
                { icon: 'pi pi-download', tooltip: 'Download', severity: 'info', onClick: (item: any) => this.downloadPdf(item) },
                { icon: 'pi pi-wallet', tooltip: 'Add Payment', severity: 'success', visible: (item: any) => item.remainingAmount > 0, onClick: (item: any) => this.openPaymentDialog(item) },
                { icon: 'pi pi-pencil', tooltip: 'Edit', severity: 'primary', visible: () => !this.isDialog, onClick: (item: any) => this.openEditDialog(item) },
                { icon: 'pi pi-trash', tooltip: 'Delete', severity: 'danger', visible: () => !this.isDialog, onClick: (item: any) => this.confirmDelete(item) }
            ]},
            { field: 'billNo', header: this.labels.BILL_NO, sortable: true, type: 'text', width: '170px', cellClass: 'fw-semibold text-muted' },
            { field: 'customerId', header: 'Cust ID', sortable: true, type: 'numeric', width: '110px', prefix: '#', cellClass: 'fw-semibold text-muted' },
            { field: 'customerName', header: this.labels.CUSTOMER_NAME, sortable: true, type: 'text', width: '300px', cellClass: 'fw-semibold' },
            { field: 'phoneNo', header: this.labels.PHONE_NO, sortable: true, type: 'text', width: '200px', icon: 'pi pi-phone small me-1', cellClass: 'small text-muted' },
            { field: 'date', header: this.labels.DATE, sortable: true, type: 'date', width: '170px', pipe: 'rfDate', cellClass: 'small' },
            { field: 'totalAmount', header: this.labels.TOTAL_AMOUNT, sortable: true, type: 'numeric', width: '190px', pipe: 'currency', pipeArgs: 'INR', cellClass: 'text-end fw-semibold' },
            { field: 'discount', header: this.labels.DISCOUNT, sortable: true, type: 'numeric', width: '190px', pipe: 'currency', pipeArgs: 'INR', cellClass: 'text-end fw-semibold text-warning' },
            { field: 'netAmount', header: this.labels.NET_AMOUNT, sortable: true, type: 'numeric', width: '190px', pipe: 'currency', pipeArgs: 'INR', cellClass: 'text-end fw-semibold text-info' },
            { field: 'paidAmount', header: this.labels.PAID_AMOUNT, sortable: true, type: 'numeric', width: '190px', pipe: 'currency', pipeArgs: 'INR', cellClass: 'text-end text-success fw-semibold' },
            { field: 'remainingAmount', header: this.labels.REMAINING_AMOUNT, sortable: true, type: 'numeric', width: '190px', pipe: 'currency', pipeArgs: 'INR', cellClass: (item: any) => `text-end fw-bold ${item.remainingAmount > 0 ? 'text-danger' : 'text-success'}` }
        ]
    };

    openPaymentDialog(item: SellingBillListDto): void {
        this.sellingBillDialogService.openPayment(item, () => this.onPaymentSaved(), () => {});
    }

    onPaymentSaved(): void {
        this.reloadGrid.emit();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payments updated successfully' });
    }

    get canSendWhatsApp(): boolean {
        return this.accountDetails.enableWhatsApp;
    }

    get canSendEmail(): boolean {
        return this.accountDetails.enableEmail;
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
        this.gridConfig.showAddButton = !this.isDialog;
        this.gridConfig.showExport = this.accountDetails.enableMigration;
        if (this.isDialog) {
            this.gridConfig.scrollHeight = 'flex';
        }
        
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
            icon: type === 'whatsapp' ? 'pi pi-whatsapp' : 'pi pi-envelope',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-text',
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
                        error: () => {}
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
                        error: () => {}
                    });
                }
            }
        });
    }

    // loadData is handled by grid dataFetcher now
    loadData(): void {
        this.reloadGrid.emit();
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
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-text',
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
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-text',
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

    onSelectionChange(selection: any[]) {
        this.selectedBills = selection;
        this.updateExportMenu();
    }
}
