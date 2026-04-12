import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BuyingBillApiService } from '../../services/buying-bill-api.service';
import { BuyingBillListDto } from '../../models/buying-bill-list.dto';
import { BuyingBillConstants } from '../../constants/buying-bill.constants';

@Component({
    selector: 'app-buying-bill-list',
    standalone: false,
    templateUrl: './buying-bill-list.component.html'
})
export class BuyingBillListComponent implements OnInit {
    private apiService = inject(BuyingBillApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    title = BuyingBillConstants.BUYING_BILL_TITLE;
    labels = BuyingBillConstants.LABELS;
    bills: BuyingBillListDto[] = [];
    
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
}
