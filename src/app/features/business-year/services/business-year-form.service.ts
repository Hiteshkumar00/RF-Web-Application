import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BusinessYearFormService {
  constructor(private fb: FormBuilder) {}

  createBusinessYearForm(): FormGroup {
    return this.fb.group({
      id: [0],
      yearName: ['', [Validators.required, Validators.maxLength(100)]],
      date: [null, [Validators.required]]
    });
  }

  resetForm(form: FormGroup): void {
    form.reset({
      id: 0,
      yearName: '',
      date: null
    });
  }
}
