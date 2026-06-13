import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AgencyPaymentApiService } from '../../services/agency-payment-api.service';
import { AgencyApiService } from '../../services/agency-api.service';
import { DropdownService } from '../../../../shared/services/dropdown.service';
import { HelperService } from '../../../../core/services/helper.service';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { CreateAgencyPaymentDto, UpdateAgencyPaymentDto } from '../../models/agency-payment.model';
import { AgencySummaryDto } from '../../models/agency-summary.dto';

@Component({
    selector: 'app-agency-payment-form-dialog',
    standalone: false,
    templateUrl: './agency-payment-form-dialog.component.html'
})
export class AgencyPaymentFormDialogComponent implements OnChanges {
    private fb = inject(FormBuilder);
    private apiService = inject(AgencyPaymentApiService);
    private agencyApiService = inject(AgencyApiService);
    private dropdownService = inject(DropdownService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;
    @Input() agencyId?: number;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    form!: FormGroup;
    agencyOptions: DropdownOption[] = [];
    paymentAccountOptions: DropdownOption[] = [];
    agencySummary: AgencySummaryDto | null = null;

    private isClosing = false;

    get transactions(): FormArray {
        return this.form.get('transactions') as FormArray;
    }

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return 'Make Agency Payment';
            case 'update': return `Update Agency Payment #${this.id}`;
            case 'view': return `View Agency Payment #${this.id}`;
            default: return '';
        }
    }

    get totalPaymentAmount(): number {
        if (!this.form) return 0;
        return this.transactions.controls.reduce((acc, control) => {
            return acc + (control.get('amount')?.value || 0);
        }, 0);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadOptions();
            this.initForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.id) {
                this.apiService.getById(this.id).subscribe({
                    next: (data) => {
                        this.patchForm(data);
                        if (this.mode === 'view') {
                            this.form.disable();
                        }
                        // Load summary for the patched agency
                        const agencyId = this.form.get('agencyId')?.value;
                        if (agencyId) this.loadAgencySummary(agencyId);
                    }
                });
            } else {
                this.addTransaction();
                if (this.agencyId) {
                    this.form.patchValue({ agencyId: this.agencyId });
                    this.loadAgencySummary(this.agencyId);
                }
            }

            // React to agency dropdown changes
            this.form.get('agencyId')?.valueChanges.subscribe(id => {
                if (id) {
                    this.loadAgencySummary(id);
                } else {
                    this.agencySummary = null;
                }
            });
        }
    }

    private loadOptions(): void {
        this.dropdownService.getAgencyOptions().subscribe({
            next: (options) => this.agencyOptions = options
        });
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => this.paymentAccountOptions = options
        });
    }

    private loadAgencySummary(agencyId: number): void {
        this.agencySummary = null;
        this.agencyApiService.getAgencySummary(agencyId).subscribe({
            next: (summary) => this.agencySummary = summary
        });
    }

    private initForm(): void {
        this.form = this.fb.group({
            id: [0],
            agencyId: [null, [Validators.required]],
            date: [new Date(), [Validators.required]],
            description: [null, [Validators.maxLength(1000)]],
            transactions: this.fb.array([], [Validators.required, Validators.minLength(1)])
        });
    }

    private patchForm(data: any): void {
        this.form.patchValue({
            id: data.id,
            agencyId: data.agencyId,
            date: new Date(data.date),
            description: data.description
        });

        const transactionsArray = this.transactions;
        transactionsArray.clear();
        data.transactions.forEach((tx: any) => {
            transactionsArray.push(this.fb.group({
                id: [tx.id || 0],
                amount: [tx.amount, [Validators.required, Validators.min(0.01)]],
                paymentAccountId: [tx.paymentAccountId, [Validators.required]],
                date: [tx.date ? new Date(tx.date) : null]
            }));
        });
    }

    addTransaction(): void {
        this.transactions.push(this.fb.group({
            id: [0],
            amount: [null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [null, [Validators.required]],
            date: [null]
        }));
    }

    removeTransaction(index: number): void {
        this.transactions.removeAt(index);
        this.transactions.markAsDirty();
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
            transactions: formValue.transactions.map((tx: any) => ({
                ...tx,
                date: tx.date ? this.helperService.setDate(tx.date) : null
            }))
        };

        if (this.mode === 'create') {
            delete payload.id;
            payload.transactions.forEach((tx: any) => delete tx.id);
            this.apiService.create(payload as CreateAgencyPaymentDto).subscribe({
                next: () => this.onSave.emit()
            });
        } else {
            this.apiService.update({ id: this.id!, ...payload } as UpdateAgencyPaymentDto).subscribe({
                next: () => this.onSave.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty && this.mode !== 'view') {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: 'Unsaved Changes',
                message: 'You have unsaved changes. Are you sure you want to discard them?',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.onClose.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.onClose.emit();
        }
    }
}
