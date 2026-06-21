import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { PaymentAccountApiService } from '../../Services/payment-account-api.service';
import { PaymentTransfer, PaymentTransferFilter } from '../../models/payment-transfer.model';
import { HelperService } from '../../../../core/services/helper.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';

@Component({
    selector: 'app-payment-transfer-list',
    standalone: false,
    templateUrl: './payment-transfer-list.component.html'
})
export class PaymentTransferListComponent implements OnInit {
    private apiService = inject(PaymentAccountApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private helperService = inject(HelperService);
    public globalConfig = inject(GlobalConfigService);
    private excelService = inject(ExcelService);

    transfers: PaymentTransfer[] = [];
    selectedTransfers: PaymentTransfer[] = [];
    exportMenuItems: MenuItem[] = [];
    loading = false;
    filter: PaymentTransferFilter = {};

    displayDialog = false;
    dialogMode: 'create' | 'update' | 'view' = 'create';
    selectedId?: number;

    ngOnInit(): void {
        this.loadTransfers();
        this.updateExportMenu();
    }

    public updateExportMenu(): void {
        this.exportMenuItems = [
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                badge: this.selectedTransfers.length > 0 ? this.selectedTransfers.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedTransfers.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    loadTransfers(): void {
        this.loading = true;
        this.apiService.getTransfers(this.filter).subscribe({
            next: (data) => {
                this.transfers = data;
                this.loading = false;
                this.updateExportMenu();
            },
            error: () => this.loading = false
        });
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedTransfers : this.transfers;

        const data = source.map(item => ({
            'ID': item.id,
            'Date': this.helperService.formatDate(item.date),
            'From Account': item.fromPaymentAccountName || '-',
            'To Account': item.toPaymentAccountName || '-',
            'Amount': item.amount || 0,
            'Description': item.description || '-'
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Payment_Transfers_Selected' : 'Payment_Transfers');
    }

    openCreate(): void {
        this.dialogMode = 'create';
        this.selectedId = undefined;
        this.displayDialog = true;
    }

    openUpdate(transfer: PaymentTransfer): void {
        this.dialogMode = 'update';
        this.selectedId = transfer.id;
        this.displayDialog = true;
    }

    openView(transfer: PaymentTransfer): void {
        this.dialogMode = 'view';
        this.selectedId = transfer.id;
        this.displayDialog = true;
    }

    deleteTransfer(id: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this transfer?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.apiService.deleteTransfer(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transfer deleted successfully' });
                        this.loadTransfers();
                    }
                });
            }
        });
    }

    onDialogSave(): void {
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transfer saved successfully' });
        this.loadTransfers();
    }

    onDialogClose(): void {
        this.displayDialog = false;
    }
}
