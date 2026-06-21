import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountPersonApiService } from '../../Services/account-person-api.service';
import { AccountPersonDto } from '../../models/account-person.model';
import { AccountPersonLabels } from '../../constants/account-person-labels.constants';
import { AccountPersonMessages } from '../../constants/account-person-messages.constants';
import { AccountPersonTable } from '../../constants/account-person-table.constants';
import { AccountPersonDialogService } from '../../Services/account-person-dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-account-person-list',
    standalone: false,
    templateUrl: './account-person-list.component.html'
})
export class AccountPersonListComponent implements OnInit {
    constructor(
        private apiService: AccountPersonApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private accountPersonDialogService: AccountPersonDialogService
    ) {}

    labels = AccountPersonLabels;
    columns = AccountPersonTable.COLUMNS;
    accountPersons: AccountPersonDto[] = [];

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            if (data['data']) {
                this.accountPersons = data['data'];
            } else {
                this.loadData();
            }
        });
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => this.accountPersons = data ?? []
        });
    }

    openCreateDialog(): void {
        this.accountPersonDialogService.openForm('create', null, () => {
            this.loadData();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: AccountPersonMessages.CREATED_SUCCESSFULLY });
        }, () => {});
    }

    openEditDialog(person: AccountPersonDto): void {
        this.accountPersonDialogService.openForm('update', person, () => {
            this.loadData();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: AccountPersonMessages.UPDATED_SUCCESSFULLY });
        }, () => {});
    }

    openViewDialog(person: AccountPersonDto): void {
        this.accountPersonDialogService.openView(person, () => {});
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
