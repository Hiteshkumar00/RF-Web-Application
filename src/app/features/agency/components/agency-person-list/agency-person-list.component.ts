import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AgencyPersonApiService } from '../../services/agency-person-api.service';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyPersonDto } from '../../models/agency-person.model';
import { AgencyPersonLabels } from '../../constants/agency-person-labels.constants';
import { AgencyPersonMessages } from '../../constants/agency-person-messages.constants';
import { AgencyPersonTableColumns } from '../../constants/agency-person-table.constants';

@Component({
    selector: 'app-agency-person-list',
    standalone: false,
    templateUrl: './agency-person-list.component.html'
})
export class AgencyPersonListComponent implements OnInit {
    private agencyPersonApiService = inject(AgencyPersonApiService);
    private agencyApiService = inject(AgencyApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    labels = AgencyPersonLabels;
    columns = AgencyPersonTableColumns.COLUMNS;
    agencyPersons: AgencyPersonDto[] = [];

    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedPerson: AgencyPersonDto | null = null;

    ngOnInit(): void {
        this.loadAgencyPersons();
    }

    loadAgencyPersons(): void {
        forkJoin({
            persons: this.agencyPersonApiService.getAll(),
            agencies: this.agencyApiService.getAll()
        }).subscribe({
            next: ({ persons, agencies }) => {
                this.agencyPersons = (persons ?? []).map(p => ({
                    ...p,
                    agencyName: agencies?.find(a => a.id === p.agencyId)?.agencyName ?? '-'
                }));
            }
        });
    }

    openCreateDialog(): void {
        this.selectedPerson = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(person: AgencyPersonDto): void {
        this.selectedPerson = person;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(person: AgencyPersonDto): void {
        this.selectedPerson = person;
        this.formDialogMode = 'view';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadAgencyPersons();
        const msg = this.formDialogMode === 'create'
            ? AgencyPersonMessages.CREATED
            : AgencyPersonMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(person: AgencyPersonDto): void {
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
        this.agencyPersonApiService.delete(id).subscribe({
            next: () => {
                this.loadAgencyPersons();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: AgencyPersonMessages.DELETED });
            }
        });
    }
}
