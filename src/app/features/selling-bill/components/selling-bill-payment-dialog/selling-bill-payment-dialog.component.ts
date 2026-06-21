import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellingBillApiService } from '../../services/selling-bill-api.service';
import { SellingBillDetailsDto, SellingBillListDto } from '../../models/selling-bill.model';
import { DropdownService } from '../../../../shared/services/dropdown.service';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { HelperService } from '../../../../core/services/helper.service';

@Component({
    selector: 'app-selling-bill-payment-dialog',
    standalone: false,
    templateUrl: './selling-bill-payment-dialog.component.html'
})
export class SellingBillPaymentDialogComponent implements OnChanges {
    private apiService = inject(SellingBillApiService);
    private fb = inject(FormBuilder);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() bill?: SellingBillListDto;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    form!: FormGroup;
    @Input() accountOptions: DropdownOption[] = [];
    @Input() billDetails?: SellingBillDetailsDto;
    loading = false;

    get payments(): FormArray {
        return this.form.get('payments') as FormArray;
    }

    get totalPaid(): number {
        return this.payments.controls.reduce((sum, control) => sum + (control.get('amount')?.value || 0), 0);
    }

    get remainingAmount(): number {
        if (!this.billDetails) return 0;
        return (this.billDetails.netAmount || 0) - this.totalPaid;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true && this.bill) {
            this.initForm();
            if (this.billDetails) {
                this.patchPayments(this.billDetails.payments);
            }
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            payments: this.fb.array([])
        });
    }


    private patchPayments(payments: any[]): void {
        const paymentFGs = payments.map(p => this.fb.group({
            id: [p.id],
            amount: [p.amount, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [p.paymentAccountId, Validators.required],
            date: [p.date ? new Date(p.date) : new Date(), Validators.required]
        }));
        const paymentFormArray = this.fb.array(paymentFGs);
        this.form.setControl('payments', paymentFormArray);
    }

    addPayment(): void {
        const paymentGroup = this.fb.group({
            id: [0],
            amount: [null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [null, Validators.required],
            date: [new Date(), Validators.required]
        });
        this.payments.push(paymentGroup);
    }

    removePayment(index: number): void {
        this.payments.removeAt(index);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payments = this.form.getRawValue().payments.map((p: any) => ({
            ...p,
            date: this.helperService.setDate(p.date)
        }));

        this.apiService.updatePayments(this.bill!.id, payments).subscribe({
            next: () => this.saved.emit()
        });
    }

    onClose(): void {
        this.closed.emit();
    }
}
