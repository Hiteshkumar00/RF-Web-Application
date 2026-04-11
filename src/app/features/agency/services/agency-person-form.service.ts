import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgencyPersonDto } from '../models/agency-person.model';

@Injectable({
    providedIn: 'root'
})
export class AgencyPersonFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            agencyId: [null, [Validators.required]],
            name: ['', [Validators.required, Validators.maxLength(250)]],
            phoneNo: [null, [Validators.maxLength(50)]],
            email: [null, [Validators.email, Validators.maxLength(250)]],
            personOccupation: [null, [Validators.maxLength(250)]],
            address: [null]
        });
    }

    patchForm(form: FormGroup, person: AgencyPersonDto): void {
        form.patchValue({
            agencyId: person.agencyId,
            name: person.name,
            phoneNo: person.phoneNo ?? null,
            email: person.email ?? null,
            personOccupation: person.personOccupation ?? null,
            address: person.address ?? null
        });
    }
}
