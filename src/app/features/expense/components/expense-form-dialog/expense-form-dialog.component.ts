import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ExpenseApiService } from '../../services/expense-api.service';
import { ExpenseFormService } from '../../services/expense-form.service';
import { ExpenseLabels } from '../../constants/expense-labels.constants';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { CreateExpenseDto } from '../../models/expense-create.dto';
import { UpdateExpenseDto } from '../../models/expense-update.dto';
import { HelperService } from '../../../../core/services/helper.service';


@Component({
    selector: 'app-expense-form-dialog',
    standalone: false,
    templateUrl: './expense-form-dialog.component.html'
})
export class ExpenseFormDialogComponent implements OnChanges {
    private expenseApiService = inject(ExpenseApiService);
    private expenseFormService = inject(ExpenseFormService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() expenseId?: number;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = ExpenseLabels;
    form!: FormGroup;
    @Input() accountOptions: DropdownOption[] = [];
    @Input() expenseData?: any;
    @Input() expenseTypeSuggestions: string[] = [];

    private isClosing = false;
    filteredExpenseTypeSuggestions: string[] = [];

    // Buying-bill linkage (display only in view mode)
    buyingBillId?: number;
    buyingBillNo?: string;
    agencyName?: string;

    get payments(): FormArray {
        return this.form.get('payments') as FormArray;
    }

    get totalPaid(): number {
        return this.payments.controls.reduce((sum, ctrl) => sum + (ctrl.get('amount')?.value || 0), 0);
    }

    get remainingAmount(): number {
        const total = this.form.get('totalAmount')?.value || 0;
        return total - this.totalPaid;
    }

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return this.labels.CREATE_DIALOG_TITLE;
            case 'update': return this.labels.UPDATE_DIALOG_TITLE;
            case 'view': return this.labels.VIEW_DIALOG_TITLE;
            default: return '';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.buyingBillId = undefined;
            this.buyingBillNo = undefined;
            this.agencyName = undefined;
            this.form = this.expenseFormService.createForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.expenseData) {
                this.expenseFormService.patchForm(this.form, this.expenseData);
                // Capture bill-linkage for the view badge
                this.buyingBillId = this.expenseData.buyingBillId;
                this.buyingBillNo = this.expenseData.buyingBillNo;
                this.agencyName = this.expenseData.agencyName;
                if (this.mode === 'view') {
                    this.form.disable();
                } else if (this.buyingBillId) {
                    // If linked to a Buying Bill, date must be strictly synced to the bill, so disable it here
                    this.form.get('date')?.disable();
                }
            }
        }
    }

    searchExpenseTypes(event: any): void {
        const query = (event.query || '').toLowerCase();
        this.filteredExpenseTypeSuggestions = this.expenseTypeSuggestions.filter(s =>
            s.toLowerCase().includes(query)
        );
    }

    onSelectExpenseType(event: any): void {
        const value = event.value || event;
        this.form.get('expenceType')?.patchValue(value);
    }

    addPayment(): void {
        this.expenseFormService.addPayment(this.form);
    }

    removePayment(index: number): void {
        this.expenseFormService.removePayment(this.form, index);
    }

    enableEditMode(): void {
        this.mode = 'update';
        this.form.enable();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        const payload = {
            ...formValue,
            date: this.helperService.setDate(formValue.date),
            payments: formValue.payments.map((p: any) => ({
                ...p,
                date: this.helperService.setDate(p.date)
            }))
        };

        if (this.mode === 'create') {
            this.expenseApiService.create(payload as CreateExpenseDto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            this.expenseApiService.update({ id: this.expenseId!, ...payload } as UpdateExpenseDto).subscribe({
                next: () => this.saved.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty) {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: this.labels.UNSAVED_HEADER,
                message: this.labels.UNSAVED_MESSAGE,
                icon: 'pi pi-exclamation-circle',
                acceptLabel: this.labels.YES,
                rejectLabel: this.labels.NO,
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.closed.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.closed.emit();
        }
    }
}
