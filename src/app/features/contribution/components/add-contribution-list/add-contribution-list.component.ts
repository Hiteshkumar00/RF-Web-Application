import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { AddContributionApiService } from '../../services/add-contribution-api.service';
import { AddContributionListDto } from '../../models/add-contribution.model';
import { ContributionConstants } from '../../constants/contribution.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';

import { ContributionDialogService } from '../../services/contribution-dialog.service';

@Component({
    selector: 'app-add-contribution-list',
    standalone: false,
    templateUrl: './add-contribution-list.component.html'
})
export class AddContributionListComponent implements OnInit {
    constructor(
        private apiService: AddContributionApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService,
        private excelService: ExcelService,
        private contributionDialogService: ContributionDialogService
    ) {}

    title = ContributionConstants.ADD_CONTRIBUTION_TITLE;
    contributions: AddContributionListDto[] = [];
    selectedContributions: AddContributionListDto[] = [];
    exportMenuItems: MenuItem[] = [];

    ngOnInit(): void {
        this.loadData();
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
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Add_Contributions_Selected' : 'Add_Contributions');
    }

    openCreateDialog(): void {
        this.contributionDialogService.openAddForm('create', undefined, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
    }

    openEditDialog(item: AddContributionListDto): void {
        this.contributionDialogService.openAddForm('update', item.id, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
    }

    openViewDialog(item: AddContributionListDto): void {
        this.contributionDialogService.openAddForm('view', item.id, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
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

    confirmDelete(item: AddContributionListDto): void {
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
