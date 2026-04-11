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
import { DropdownService } from '../../../../shared/services/dropdown.service';

@Component({
    selector: 'app-expense-form-dialog',
    standalone: false,
    templateUrl: './expense-form-dialog.component.html'
})
export class ExpenseFormDialogComponent implements OnChanges {
    private expenseApiService = inject(ExpenseApiService);
    private expenseFormService = inject(ExpenseFormService);
    private dropdownService = inject(DropdownService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() expenseId?: number;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = ExpenseLabels;
    form!: FormGroup;
    accountOptions: DropdownOption[] = [];
    private isClosing = false;

    get payments(): FormArray {
        return this.form.get('payments') as FormArray;
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
            this.loadAccountOptions();
            this.form = this.expenseFormService.createForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.expenseId) {
                this.expenseApiService.getById(this.expenseId).subscribe({
                    next: (data) => {
                        this.expenseFormService.patchForm(this.form, data);
                        if (this.mode === 'view') {
                            this.form.disable();
                        }
                    }
                });
            } else {
                // Add initial payment row for create mode
                this.addPayment();
            }
        }
    }

    private loadAccountOptions(): void {
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => {
                this.accountOptions = options;
            }
        });
    }

    addPayment(): void {
        this.expenseFormService.addPayment(this.form);
    }

    removePayment(index: number): void {
        this.expenseFormService.removePayment(this.form, index);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        // Use HelperService to convert Date to YYYY-MM-DD
        const payload = {
            ...formValue,
            date: this.helperService.setDate(formValue.date)
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

