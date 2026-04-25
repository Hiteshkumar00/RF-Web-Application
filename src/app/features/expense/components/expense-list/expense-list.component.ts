import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExpenseApiService } from '../../services/expense-api.service';
import { ExpenseListDto, ExpenseDto } from '../../models/expense.model';
import { ExpenseLabels } from '../../constants/expense-labels.constants';
import { ExpenseMessages } from '../../constants/expense-messages.constants';
import { ExpenseTableColumns } from '../../constants/expense-table.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';

@Component({
    selector: 'app-expense-list',
    standalone: false,
    templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
    constructor(
        private expenseApiService: ExpenseApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public globalConfig: GlobalConfigService
    ) {}

    labels = ExpenseLabels;
    columns = ExpenseTableColumns.COLUMNS;
    expenses: ExpenseListDto[] = [];

    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedExpenseId?: number;

    ngOnInit(): void {
        this.loadExpenses();
    }

    loadExpenses(): void {
        this.expenseApiService.getAll().subscribe({
            next: (data) => {
                this.expenses = data ?? [];
            }
        });
    }

    openCreateDialog(): void {
        this.selectedExpenseId = undefined;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(expense: ExpenseListDto): void {
        this.selectedExpenseId = expense.id;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(expense: ExpenseListDto): void {
        this.selectedExpenseId = expense.id;
        this.formDialogMode = 'view';
        this.showFormDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadExpenses();
        const msg = this.formDialogMode === 'create'
            ? ExpenseMessages.CREATED
            : ExpenseMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(expense: ExpenseListDto): void {
        this.confirmationService.confirm({
            header: this.labels.DELETE_HEADER,
            message: this.labels.DELETE_MESSAGE,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteExpense(expense.id)
        });
    }

    private deleteExpense(id: number): void {
        this.expenseApiService.delete(id).subscribe({
            next: () => {
                this.loadExpenses();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: ExpenseMessages.DELETED });
            }
        });
    }
}
