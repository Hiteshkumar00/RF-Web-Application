import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductApiService } from '../../services/product-api.service';
import { CreateProductDto, UpdateProductDto, ProductDto } from '../../models/product.dto';

@Component({
  selector: 'app-product-form-dialog',
  standalone: false,
  templateUrl: './product-dialog.component.html'
})
export class ProductFormDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private apiService = inject(ProductApiService);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Input() mode: 'create' | 'update' | 'view' = 'create';
  @Input() id?: number;

  @Output() onSave = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;
  dialogTitle = '';

  constructor() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue) {
      this.updateTitle();
      if ((this.mode === 'update' || this.mode === 'view') && this.id) {
        this.loadProduct();
      } else {
        this.initForm();
      }
    }
  }

  private updateTitle(): void {
    if (this.mode === 'create') this.dialogTitle = 'New Product';
    else if (this.mode === 'update') this.dialogTitle = 'Edit Product';
    else this.dialogTitle = 'Product Details';
  }

  private initForm(): void {
    this.form = this.fb.group({
      productName: ['', [Validators.required, Validators.maxLength(200)]],
      imageLink: [''],
      warrantyYear: [0, [Validators.min(0), Validators.max(50)]],
      warrantyMonth: [0, [Validators.min(0), Validators.max(11)]],
      warrantyDay: [0, [Validators.min(0), Validators.max(31)]]
    });
  }

  private loadProduct(): void {
    if (!this.id) return;
    this.apiService.getById(this.id).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            productName: data.productName,
            imageLink: data.imageLink,
            warrantyYear: data.warrantyYear || 0,
            warrantyMonth: data.warrantyMonth || 0,
            warrantyDay: data.warrantyDay || 0
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
      productName: formData.productName,
      imageLink: formData.imageLink,
      warrantyYear: formData.warrantyYear,
      warrantyMonth: formData.warrantyMonth,
      warrantyDay: formData.warrantyDay
    };

    if (this.mode === 'create') {
      this.apiService.create(payload as CreateProductDto).subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product created' });
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
      this.apiService.update(payload as UpdateProductDto).subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated' });
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
