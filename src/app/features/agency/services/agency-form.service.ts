import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgencyDto } from '../models/agency.model';

@Injectable({
    providedIn: 'root'
})
export class AgencyFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            agencyName: ['', [Validators.required, Validators.maxLength(250)]],
            address: [null]
        });
    }

    createUpdateForm(): FormGroup {
        return this.fb.group({
            agencyName: ['', [Validators.required, Validators.maxLength(250)]],
            address: [null]
        });
    }

    patchForm(form: FormGroup, agency: AgencyDto): void {
        form.patchValue({
            agencyName: agency.agencyName,
            address: agency.address ?? null
        });
    }
}
