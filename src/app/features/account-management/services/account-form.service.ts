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
            currencyType: [null],
            enableSuggestions: [false]
        });
    }

    patchForm(form: FormGroup, account: AccountDto): void {
        form.patchValue({
            profileName: account.profileName,
            profileLogoLink: account.profileLogoLink ?? null,
            currencyType: account.currencyType ?? null,
            enableSuggestions: account.enableSuggestions ?? false
        });
    }
}
