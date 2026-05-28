import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ExpenseApiService } from '../../services/expense-api.service';
import { ExpenseListDto } from '../../models/expense.model';
import { ExpenseLabels } from '../../constants/expense-labels.constants';
import { ExpenseMessages } from '../../constants/expense-messages.constants';
import { ExpenseTableColumns } from '../../constants/expense-table.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { StatisticCard } from '../../../../shared/models/statistic-card.model';

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
        public globalConfig: GlobalConfigService,
        private excelService: ExcelService,
        private helperService: HelperService,
        public accountDetailsService: AccountDetailsService
    ) {}

    labels = ExpenseLabels;
    columns = ExpenseTableColumns.COLUMNS;
    expenses: ExpenseListDto[] = [];
    selectedExpenses: ExpenseListDto[] = [];

    exportMenuItems: MenuItem[] = [];
    
    public updateExportMenu(): void {
        this.exportMenuItems = [
            { 
                label: 'Export Selected', 
                icon: 'pi pi-check-square', 
                badge: this.selectedExpenses.length > 0 ? this.selectedExpenses.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedExpenses.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    showFormDialog = false;
    formDialogMode: 'create' | 'update' | 'view' = 'create';
    selectedExpenseId?: number;

    // Summary totals
    get totalExpenseAmount(): number {
        return this.expenses.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
    }

    get totalPaidAmount(): number {
        return this.expenses.reduce((sum, e) => sum + (e.paidAmount || 0), 0);
    }

    get totalRemainingAmount(): number {
        return this.expenses.reduce((sum, e) => sum + (e.remainingAmount || 0), 0);
    }

    get statisticCards(): StatisticCard[] {
        return [
            { title: 'Total Expense', amount: this.totalExpenseAmount, colorClass: 'info', icon: 'pi-wallet' },
            { title: 'Total Paid', amount: this.totalPaidAmount, colorClass: 'success', icon: 'pi-check-circle' },
            { title: 'Total Remaining', amount: this.totalRemainingAmount, colorClass: '', icon: 'pi-clock', isRemaining: true }
        ];
    }

    ngOnInit(): void {
        this.loadExpenses();
        this.updateExportMenu();
    }

    loadExpenses(): void {
        this.expenseApiService.getAll().subscribe({
            next: (data) => {
                this.expenses = data ?? [];
                this.updateExportMenu();
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

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedExpenses : this.expenses;

        const data = source.map(item => ({
            'ID': item.id,
            [this.labels.EXPENSE_TYPE]: item.expenceType || '-',
            'Agency': item.agencyName || '-',
            'Bill No': item.buyingBillNo || '-',
            [this.labels.DATE]: this.helperService.formatDate(item.date),
            [this.labels.TOTAL_AMOUNT]: item.totalAmount,
            [this.labels.PAID_AMOUNT]: item.paidAmount,
            [this.labels.REMAINING_AMOUNT]: item.remainingAmount
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Expenses_Selected' : 'Expenses');
    }
}
