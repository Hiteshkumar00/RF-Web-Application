import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountApiService } from '../../services/account-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { AccountDto } from '../../models/account.model';
import { AccountLabels } from '../../constants/account-labels.constants';
import { AccountMessages } from '../../constants/account-messages.constants';
import { AccountTableColumns } from '../../constants/account-table.constants';
import { AuthApiService } from '../../../auth/services/auth-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SystemConfigurationService } from '../../../system-configuration/services/system-configuration.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-list',
    standalone: false,
    templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
    constructor(
        private accountApiService: AccountApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService,
        private authApiService: AuthApiService,
        private authService: AuthService,
        private router: Router
    ) {}

    labels = AccountLabels;
    columns = AccountTableColumns.COLUMNS;
    accounts: AccountDto[] = [];
    isDeleteEnabled = false;

    // Dialog control
    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedAccount: AccountDto | null = null;

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.accountApiService.getAll().subscribe({
            next: (data) => this.accounts = data ?? []
        });
    }

    openCreateDialog(): void {
        this.selectedAccount = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(account: AccountDto): void {
        this.selectedAccount = account;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(account: AccountDto): void {
        this.selectedAccount = account;
        this.formDialogMode = 'view';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadAccounts();
        const msg = this.formDialogMode === 'create'
            ? AccountMessages.CREATED
            : AccountMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(account: AccountDto): void {
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
        this.accountApiService.delete(id).subscribe({
            next: () => {
                this.loadAccounts();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: AccountMessages.DELETED });
            }
        });
    }

    loginAsAdmin(accountId: number): void {
        this.authApiService.loginAsAdmin(accountId).subscribe({
            next: (token) => {
                this.authService.setAuthenticationToken(token);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in as account successfully' });
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed' });
            }
        });
    }
}
