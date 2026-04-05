import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDto } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserFormService {
    private fb = inject(FormBuilder);

    createUserForm(): FormGroup {
        return this.fb.group({
            accountId: [null],
            firstName: ['', [Validators.required, Validators.maxLength(100)]],
            middleName: [null],
            surname: ['', [Validators.required, Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNo: [null],
            role: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
            isActive: [true, [Validators.required]]
        });
    }

    createUpdateForm(): FormGroup {
        return this.fb.group({
            accountId: [null],
            firstName: ['', [Validators.required, Validators.maxLength(100)]],
            middleName: [null],
            surname: ['', [Validators.required, Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNo: [null],
            role: ['', [Validators.required]],
            isActive: [true, [Validators.required]]
        });
    }

    patchForm(form: FormGroup, user: UserDto): void {
        form.patchValue({
            accountId: user.accountId ?? null,
            firstName: user.firstName,
            middleName: user.middleName ?? null,
            surname: user.surname,
            email: user.email,
            phoneNo: user.phoneNo ?? null,
            role: user.role,
            isActive: user.isActive
        });
    }
}
