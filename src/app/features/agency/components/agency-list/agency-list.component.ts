import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyDto } from '../../models/agency.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { AgencyMessages } from '../../constants/agency-messages.constants';
import { AgencyTableColumns } from '../../constants/agency-table.constants';

@Component({
    selector: 'app-agency-list',
    standalone: false,
    templateUrl: './agency-list.component.html'
})
export class AgencyListComponent implements OnInit {
    private agencyApiService = inject(AgencyApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    labels = AgencyLabels;
    columns = AgencyTableColumns.COLUMNS;
    agencies: AgencyDto[] = [];

    showFormDialog = false;
    formDialogMode: 'create' | 'update' = 'create';
    selectedAgency: AgencyDto | null = null;

    ngOnInit(): void {
        this.loadAgencies();
    }

    loadAgencies(): void {
        this.agencyApiService.getAll().subscribe({
            next: (data) => this.agencies = data ?? []
        });
    }

    openCreateDialog(): void {
        this.selectedAgency = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(agency: AgencyDto): void {
        this.selectedAgency = agency;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadAgencies();
        const msg = this.formDialogMode === 'create'
            ? AgencyMessages.CREATED
            : AgencyMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
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
