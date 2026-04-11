import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddContributionApiService } from '../../services/add-contribution-api.service';
import { AddContributionListDto } from '../../models/add-contribution.model';
import { ContributionConstants } from '../../constants/contribution.constants';

@Component({
    selector: 'app-add-contribution-list',
    standalone: false,
    templateUrl: './add-contribution-list.component.html'
})
export class AddContributionListComponent implements OnInit {
    private apiService = inject(AddContributionApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    title = ContributionConstants.ADD_CONTRIBUTION_TITLE;
    contributions: AddContributionListDto[] = [];
    
    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedId?: number;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => {
                this.contributions = data ?? [];
            }
        });
    }

    openCreateDialog(): void {
        this.selectedId = undefined;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(item: AddContributionListDto): void {
        this.selectedId = item.id;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(item: AddContributionListDto): void {
        this.selectedId = item.id;
        this.formDialogMode = 'view';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadData();
        const msg = this.formDialogMode === 'create'
            ? ContributionConstants.MESSAGES.CREATE_SUCCESS(this.title)
            : ContributionConstants.MESSAGES.UPDATE_SUCCESS(this.title);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
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
