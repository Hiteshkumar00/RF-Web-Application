import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePaymentTransfer, PaymentTransfer, UpdatePaymentTransfer } from '../models/payment-transfer.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentTransferFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            id: [0],
            fromPaymentAccountId: [null, Validators.required],
            toPaymentAccountId: [null, Validators.required],
            amount: [null, [Validators.required, Validators.min(0.01)]],
            description: [''],
            date: [new Date(), Validators.required]
        });
    }

    patchForm(form: FormGroup, data: PaymentTransfer): void {
        form.patchValue({
            ...data,
            date: data.date ? new Date(data.date) : new Date()
        });
    }
}
