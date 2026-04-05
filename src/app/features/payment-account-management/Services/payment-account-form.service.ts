import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentAccountDto } from '../models/payment-account.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentAccountFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            id: [null],
            methodName: ['', [Validators.required, Validators.maxLength(250)]],
            accountPersonId: [null]
        });
    }

    patchForm(form: FormGroup, account: PaymentAccountDto): void {
        form.patchValue({
            id: account.id,
            methodName: account.methodName,
            accountPersonId: account.accountPersonId ?? null
        });
    }
}
