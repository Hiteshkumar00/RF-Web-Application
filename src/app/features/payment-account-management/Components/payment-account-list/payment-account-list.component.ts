import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaymentAccountApiService } from '../../Services/payment-account-api.service';
import { PaymentAccountDto } from '../../models/payment-account.model';
import { PaymentAccountLabels } from '../../constants/payment-account-labels.constants';
import { PaymentAccountMessages } from '../../constants/payment-account-messages.constants';
import { PaymentAccountTableColumns } from '../../constants/payment-account-table.constants';
import { AccountPersonApiService } from '../../../account-person-management/Services/account-person-api.service';
import { forkJoin } from 'rxjs';
import { GlobalConfigService } from '../../../../core/services/global-config.service';

@Component({
    selector: 'app-payment-account-list',
    templateUrl: './payment-account-list.component.html',
    standalone: false
})
export class PaymentAccountListComponent implements OnInit {
    constructor(
        private paymentAccountApiService: PaymentAccountApiService,
        private accountPersonApiService: AccountPersonApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService
    ) {}

    labels = PaymentAccountLabels;
    columns = PaymentAccountTableColumns.COLUMNS;
    paymentAccounts: PaymentAccountDto[] = [];

    // Dialog control
    showFormDialog = false;
    showViewDialog = false;
    formDialogMode: 'create' | 'update' = 'create';
    selectedAccount: PaymentAccountDto | null = null;

    ngOnInit(): void {
        this.loadPaymentAccounts();
    }

    loadPaymentAccounts(): void {
        forkJoin({
            accounts: this.paymentAccountApiService.getAll(),
            persons: this.accountPersonApiService.getAll()
        }).subscribe({
            next: (data) => {
                const personMap = new Map(data.persons.map(p => [p.id, p.name]));
                this.paymentAccounts = data.accounts.map(account => ({
                    ...account,
                    accountPersonName: account.accountPersonId ? personMap.get(account.accountPersonId) : undefined
                }));
            }
        });
    }

    openCreateDialog(): void {
        this.selectedAccount = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(account: PaymentAccountDto): void {
        this.selectedAccount = account;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(account: PaymentAccountDto): void {
        this.selectedAccount = account;
        this.showViewDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadPaymentAccounts();
        const msg = this.formDialogMode === 'create' 
            ? PaymentAccountMessages.CREATED 
            : PaymentAccountMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(account: PaymentAccountDto): void {
        this.confirmationService.confirm({
            header: this.labels.DELETE_CONFIRM_HEADER,
            message: this.labels.DELETE_CONFIRM_MESSAGE,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteAccount(account.id)
        });
    }

    private deleteAccount(id: number): void {
        this.paymentAccountApiService.delete(id).subscribe({
            next: () => {
                this.loadPaymentAccounts();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: PaymentAccountMessages.DELETED });
            }
        });
    }
}
