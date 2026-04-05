import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountPersonApiService } from '../../Services/account-person-api.service';
import { AccountPersonDto } from '../../models/account-person.model';
import { AccountPersonLabels } from '../../constants/account-person-labels.constants';
import { AccountPersonMessages } from '../../constants/account-person-messages.constants';
import { AccountPersonTable } from '../../constants/account-person-table.constants';

@Component({
    selector: 'app-account-person-list',
    standalone: false,
    templateUrl: './account-person-list.component.html'
})
export class AccountPersonListComponent implements OnInit {
    private apiService = inject(AccountPersonApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    labels = AccountPersonLabels;
    columns = AccountPersonTable.COLUMNS;
    accountPersons: AccountPersonDto[] = [];

    showFormDialog = false;
    showViewDialog = false;
    formDialogMode: 'create' | 'update' = 'create';
    selectedPerson: AccountPersonDto | null = null;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => this.accountPersons = data ?? []
        });
    }

    openCreateDialog(): void {
        this.selectedPerson = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(person: AccountPersonDto): void {
        this.selectedPerson = person;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(person: AccountPersonDto): void {
        this.selectedPerson = person;
        this.showViewDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadData();
        const msg = this.formDialogMode === 'create'
            ? AccountPersonMessages.CREATED_SUCCESSFULLY
            : AccountPersonMessages.UPDATED_SUCCESSFULLY;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(person: AccountPersonDto): void {
        this.confirmationService.confirm({
            header: this.labels.DELETE_CONFIRM_HEADER,
            message: this.labels.DELETE_CONFIRM_MESSAGE,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deletePerson(person.id)
        });
    }

    private deletePerson(id: number): void {
        this.apiService.delete(id).subscribe({
            next: () => {
                this.loadData();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: AccountPersonMessages.DELETED_SUCCESSFULLY });
            }
        });
    }
}
