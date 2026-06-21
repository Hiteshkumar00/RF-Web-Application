import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerApiService } from '../../services/customer-api.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../../models/customer.model';

@Component({
  selector: 'app-customer-form-dialog',
  standalone: false,
  templateUrl: './customer-form-dialog.component.html'
})
export class CustomerFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(CustomerApiService);

  @Input() mode: 'create' | 'update' | 'view' = 'create';
  @Input() id?: number;

  @Output() onSave = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;
  dialogTitle = '';
  visible = true;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.updateTitle();
    if ((this.mode === 'update' || this.mode === 'view') && this.id) {
      this.loadCustomer();
    } else {
      this.initForm();
    }
  }

  private updateTitle(): void {
    if (this.mode === 'create') this.dialogTitle = 'New Customer';
    else if (this.mode === 'update') this.dialogTitle = 'Edit Customer';
    else this.dialogTitle = 'Customer Details';
  }

  private initForm(): void {
    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(250)]],
      phoneNo: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(250)]],
      address: ['', [Validators.maxLength(500)]]
    });
  }

  private loadCustomer(): void {
    if (!this.id) return;
    this.apiService.getById(this.id).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            customerName: data.customerName,
            phoneNo: data.phoneNo || '',
            email: data.email || '',
            address: data.address || ''
          });
          if (this.mode === 'view') {
            this.form.disable();
          } else {
            this.form.enable();
          }
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formData = this.form.value;

    const payload: any = {
      customerName: formData.customerName,
      phoneNo: formData.phoneNo || null,
      email: formData.email || null,
      address: formData.address || null
    };

    if (this.mode === 'create') {
      this.apiService.create(payload as CreateCustomerDto).subscribe({
        next: (res) => {
          if (res) {
            this.onSave.emit();
            this.close();
          }
          this.saving = false;
        },
        error: () => {
          this.saving = false;
        }
      });
    } else {
      payload.id = this.id!;
      this.apiService.update(payload as UpdateCustomerDto).subscribe({
        next: (res) => {
          if (res) {
            this.onSave.emit();
            this.close();
          }
          this.saving = false;
        },
        error: () => {
          this.saving = false;
        }
      });
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
