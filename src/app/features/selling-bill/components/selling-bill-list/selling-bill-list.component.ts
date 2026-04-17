import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SellingBillApiService } from '../../services/selling-bill-api.service';
import { SellingBillListDto } from '../../models/selling-bill.model';
import { SellingBillConstants } from '../../constants/selling-bill.constants';
import { BillDownloadService } from '../../../../shared/services/bill-download.service';
import { WhatsAppService } from '../../../../shared/services/whatsapp.service';
import { AccountDetailsService } from '../../../../core/services/account-details.service';

@Component({
    selector: 'app-selling-bill-list',
    standalone: false,
    templateUrl: './selling-bill-list.component.html'
})
export class SellingBillListComponent implements OnInit {
    private apiService = inject(SellingBillApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private downloadService = inject(BillDownloadService);
    private accountDetailsService = inject(AccountDetailsService);
    private whatsAppService = inject(WhatsAppService);

    get canSendWhatsApp(): boolean {
        return this.accountDetailsService.enableWhatsApp;
    }

    title = SellingBillConstants.SELLING_BILL_TITLE;
    labels = SellingBillConstants.LABELS;
    bills: SellingBillListDto[] = [];

    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedId?: number;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => {
                this.bills = data ?? [];
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
                this.whatsAppService.sendBillOnWhatsApp(item, blob);
            },
            error: () => {
                this.whatsAppService.sendBillOnWhatsApp(item); // Fallback to link only
            }
        });
    }
}
