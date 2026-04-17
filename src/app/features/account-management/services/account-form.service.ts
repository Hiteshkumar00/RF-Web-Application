import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountDto } from '../models/account.model';

@Injectable({
    providedIn: 'root'
})
export class AccountFormService {
    private fb = inject(FormBuilder);

    createAccountForm(): FormGroup {
        return this.fb.group({
            profileName: ['', [Validators.required, Validators.maxLength(100)]],
            profileLogoLink: [null],
            title: [null, [Validators.maxLength(250)]],
            address: [null, [Validators.maxLength(500)]],
            phone: [null, [Validators.maxLength(50)]],
            email: [null, [Validators.email, Validators.maxLength(100)]],
            gstin: [null, [Validators.maxLength(50)]],
            currencyType: [null],
            enableSuggestions: [false]
        });
    }

    patchForm(form: FormGroup, account: AccountDto): void {
        form.patchValue({
            profileName: account.profileName,
            profileLogoLink: account.profileLogoLink ?? null,
            title: account.title ?? null,
            address: account.address ?? null,
            phone: account.phone ?? null,
            email: account.email ?? null,
            gstin: account.gstin ?? null,
            currencyType: account.currencyType ?? null,
            enableSuggestions: account.enableSuggestions ?? false
        });
    }
}
