import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AgencyPersonApiService } from '../../services/agency-person-api.service';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyPersonDto } from '../../models/agency-person.model';
import { AgencyPersonLabels } from '../../constants/agency-person-labels.constants';
import { AgencyPersonMessages } from '../../constants/agency-person-messages.constants';
import { AgencyPersonTableColumns } from '../../constants/agency-person-table.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { AgencyDialogService } from '../../services/agency-dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-agency-person-list',
    standalone: false,
    templateUrl: './agency-person-list.component.html'
})
export class AgencyPersonListComponent implements OnInit {
    constructor(
        private agencyPersonApiService: AgencyPersonApiService,
        private agencyApiService: AgencyApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService,
        private route: ActivatedRoute,
        private agencyDialogService: AgencyDialogService
    ) {}

    labels = AgencyPersonLabels;
    columns = AgencyPersonTableColumns.COLUMNS;
    agencyPersons: AgencyPersonDto[] = [];

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            if (data['data']) {
                this.agencyPersons = data['data'];
            } else {
                this.loadAgencyPersons();
            }
        });
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
        this.agencyDialogService.openPersonForm('create', null, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
    }

    openEditDialog(person: AgencyPersonDto): void {
        this.agencyDialogService.openPersonForm('update', person, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
    }

    openViewDialog(person: AgencyPersonDto): void {
        this.agencyDialogService.openPersonForm('view', person, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
    }

    onFormSaved(mode: 'create' | 'update' | 'view'): void {
        this.loadAgencyPersons();
        if (mode !== 'view') {
            const msg = mode === 'create'
                ? AgencyPersonMessages.CREATED
                : AgencyPersonMessages.UPDATED;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        }
    }

    onFormDialogClosed(): void {
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
