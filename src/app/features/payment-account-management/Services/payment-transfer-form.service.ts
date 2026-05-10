import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
        }, { validators: this.sameAccountValidator() });
    }

    private sameAccountValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const fromId = control.get('fromPaymentAccountId')?.value;
            const toId = control.get('toPaymentAccountId')?.value;

            if (fromId && toId && fromId === toId) {
                return { sameAccount: true };
            }
            return null;
        };
    }

    patchForm(form: FormGroup, data: PaymentTransfer): void {
        form.patchValue({
            ...data,
            date: data.date ? new Date(data.date) : new Date()
        });
    }
}
