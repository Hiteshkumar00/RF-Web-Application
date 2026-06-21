import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgencyApiService } from '../../services/agency-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { AgencyDto } from '../../models/agency.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { AgencyMessages } from '../../constants/agency-messages.constants';
import { AgencyTableColumns } from '../../constants/agency-table.constants';

import { AgencyDialogService } from '../../services/agency-dialog.service';

@Component({
    selector: 'app-agency-list',
    standalone: false,
    templateUrl: './agency-list.component.html'
})
export class AgencyListComponent implements OnInit {
    constructor(
        private agencyApiService: AgencyApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService,
        private agencyDialogService: AgencyDialogService
    ) {}

    labels = AgencyLabels;
    columns = AgencyTableColumns.COLUMNS;
    agencies: AgencyDto[] = [];

    ngOnInit(): void {
        this.loadAgencies();
    }

    loadAgencies(): void {
        this.agencyApiService.getAll().subscribe({
            next: (data) => this.agencies = data ?? []
        });
    }

    openCreateDialog(): void {
        this.agencyDialogService.openForm('create', null, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
    }

    openEditDialog(agency: AgencyDto): void {
        this.agencyDialogService.openForm('update', agency, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
    }

    onFormSaved(mode: 'create' | 'update'): void {
        this.loadAgencies();
        const msg = mode === 'create'
            ? AgencyMessages.CREATED
            : AgencyMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
    }

    confirmDelete(agency: AgencyDto): void {
        this.confirmationService.confirm({
            header: this.labels.DELETE_CONFIRM_HEADER,
            message: this.labels.DELETE_CONFIRM_MESSAGE,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteAgency(agency.id)
        });
    }

    private deleteAgency(id: number): void {
        this.agencyApiService.delete(id).subscribe({
            next: () => {
                this.loadAgencies();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: AgencyMessages.DELETED });
            }
        });
    }
}
