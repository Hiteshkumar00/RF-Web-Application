import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { RemoveContributionApiService } from '../../services/remove-contribution-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { RemoveContributionListDto } from '../../models/remove-contribution.model';
import { ContributionConstants } from '../../constants/contribution.constants';
import { ExcelService } from '../../../../shared/services/excel.service';
import { ActivatedRoute } from '@angular/router';

import { ContributionDialogService } from '../../services/contribution-dialog.service';

@Component({
    selector: 'app-remove-contribution-list',
    standalone: false,
    templateUrl: './remove-contribution-list.component.html'
})
export class RemoveContributionListComponent implements OnInit {
    constructor(
        private apiService: RemoveContributionApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService,
        private route: ActivatedRoute,
        private excelService: ExcelService,
        private contributionDialogService: ContributionDialogService
    ) {}

    title = ContributionConstants.REMOVE_CONTRIBUTION_TITLE;
    contributions: RemoveContributionListDto[] = [];
    selectedContributions: RemoveContributionListDto[] = [];
    exportMenuItems: MenuItem[] = [];

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            if (data['data']) {
                this.contributions = data['data'];
            } else {
                this.loadData();
            }
        });
        this.updateExportMenu();
    }

    public updateExportMenu(): void {
        this.exportMenuItems = [
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                badge: this.selectedContributions.length > 0 ? this.selectedContributions.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedContributions.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => {
                this.contributions = data ?? [];
                this.updateExportMenu();
            }
        });
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedContributions : this.contributions;

        const data = source.map(item => ({
            'ID': item.id,
            'Person Name': item.accountPersonName || '-',
            'Description': item.description || '-',
            'Date': item.date,
            'Total Amount': item.totalAmount || 0
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Remove_Contributions_Selected' : 'Remove_Contributions');
    }

    openCreateDialog(): void {
        this.contributionDialogService.openRemoveForm('create', undefined, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
    }

    openEditDialog(item: RemoveContributionListDto): void {
        this.contributionDialogService.openRemoveForm('update', item.id, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
    }

    openViewDialog(item: RemoveContributionListDto): void {
        this.contributionDialogService.openRemoveForm('view', item.id, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
    }

    onFormSaved(mode: 'create' | 'update' | 'view'): void {
        this.loadData();
        if (mode !== 'view') {
            const msg = mode === 'create'
                ? ContributionConstants.MESSAGES.CREATE_SUCCESS(this.title)
                : ContributionConstants.MESSAGES.UPDATE_SUCCESS(this.title);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        }
    }

    onFormDialogClosed(): void {
    }

    confirmDelete(item: RemoveContributionListDto): void {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: ContributionConstants.MESSAGES.DELETE_CONFIRM(this.title),
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
                    detail: ContributionConstants.MESSAGES.DELETE_SUCCESS(this.title) 
                });
            }
        });
    }
}
