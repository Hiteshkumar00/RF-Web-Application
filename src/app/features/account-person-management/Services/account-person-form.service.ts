import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountPersonDto } from '../models/account-person.model';

@Injectable({
    providedIn: 'root'
})
export class AccountPersonFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            id: [0],
            name: ['', [Validators.required, Validators.maxLength(250)]],
            phoneNo: ['', [Validators.maxLength(50)]],
            email: ['', [Validators.email, Validators.maxLength(250)]],
            personOccupation: ['', [Validators.maxLength(250)]],
            address: ['']
        });
    }

    patchForm(form: FormGroup, person: AccountPersonDto): void {
        form.patchValue({
            id: person.id,
            name: person.name,
            phoneNo: person.phoneNo ?? '',
            email: person.email ?? '',
            personOccupation: person.personOccupation ?? '',
            address: person.address ?? ''
        });
    }
}
