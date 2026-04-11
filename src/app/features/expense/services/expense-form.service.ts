import { Injectable, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseDto, ExpensePaymentDto } from '../models/expense.model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            expenceType: [null, [Validators.required, Validators.maxLength(250)]],
            date: [new Date(), [Validators.required]],
            payments: this.fb.array([], [Validators.required, Validators.minLength(1)])
        });
    }

    createPaymentForm(payment?: ExpensePaymentDto): FormGroup {
        return this.fb.group({
            id: [payment?.id || 0],
            amount: [payment?.amount || null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [payment?.paymentAccountId || null, [Validators.required]]
        });
    }

    patchForm(form: FormGroup, data: ExpenseDto): void {
        form.patchValue({
            expenceType: data.expenceType,
            date: new Date(data.date)
        });

        const paymentsArray = form.get('payments') as FormArray;
        paymentsArray.clear();
        data.payments.forEach(p => {
            paymentsArray.push(this.createPaymentForm(p));
        });
    }

    addPayment(form: FormGroup): void {
        const paymentsArray = form.get('payments') as FormArray;
        paymentsArray.push(this.createPaymentForm());
    }

    removePayment(form: FormGroup, index: number): void {
        const paymentsArray = form.get('payments') as FormArray;
        paymentsArray.removeAt(index);
        paymentsArray.markAsDirty();
    }
}
