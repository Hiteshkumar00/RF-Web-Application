import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { SellingBillApiService } from '../../services/selling-bill-api.service';
import { SellingBillFormService } from '../../services/selling-bill-form.service';
import { SellingBillConstants } from '../../constants/selling-bill.constants';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { CreateSellingBillDto } from '../../models/create-selling-bill.dto';
import { UpdateSellingBillDto } from '../../models/update-selling-bill.dto';
import { HelperService } from '../../../../core/services/helper.service';
import { DropdownService } from '../../../../shared/services/dropdown.service';

@Component({
    selector: 'app-selling-bill-form-dialog',
    standalone: false,
    templateUrl: './selling-bill-form-dialog.component.html'
})
export class SellingBillFormDialogComponent implements OnChanges {
    private apiService = inject(SellingBillApiService);
    private formService = inject(SellingBillFormService);
    private dropdownService = inject(DropdownService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    title = SellingBillConstants.SELLING_BILL_TITLE;
    labels = SellingBillConstants.LABELS;
    form!: FormGroup;
    accountOptions: DropdownOption[] = [];
    globalHasWarrenty: boolean = false;
    private isClosing = false;

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    get payments(): FormArray {
        return this.form.get('payments') as FormArray;
    }

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return `${this.title}`;
            case 'update': return `Update ${this.title} #${this.id}`;
            case 'view': return `View ${this.title} #${this.id}`;
            default: return '';
        }
    }

    get totalAmount(): number {
        if (!this.form) return 0;
        return this.items.controls.reduce((acc, control) => {
            const price = control.get('price')?.value || 0;
            const quantity = control.get('quantity')?.value || 0;
            return acc + (price * quantity);
        }, 0);
    }

    get finalAmount(): number {
        if (!this.form) return 0;
        const discount = this.form.get('discount')?.value || 0;
        return this.totalAmount - discount;
    }

    get paidAmount(): number {
        if (!this.form) return 0;
        return this.payments.controls.reduce((acc, control) => {
            return acc + (control.get('amount')?.value || 0);
        }, 0);
    }

    get remainingAmount(): number {
        return this.finalAmount - this.paidAmount;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadOptions();
            this.form = this.formService.createForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.id) {
                this.apiService.getById(this.id).subscribe({
                    next: (data) => {
                        this.formService.patchForm(this.form, data);
                        this.globalHasWarrenty = data.items.some(i => !!(i.warrenty && (i.warrenty.year > 0 || i.warrenty.month > 0 || i.warrenty.day > 0)));
                        if (this.mode === 'view') {
                            this.form.disable();
                        }
                    }
                });
            } else {
                this.globalHasWarrenty = false;
                this.addItem();
            }
        }
    }

    private loadOptions(): void {
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => this.accountOptions = options
        });
    }

    addItem(): void {
        this.formService.addItem(this.form);
    }

    removeItem(index: number): void {
        this.formService.removeItem(this.form, index);
    }

    addPayment(): void {
        this.formService.addPayment(this.form);
    }

    removePayment(index: number): void {
        this.formService.removePayment(this.form, index);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        const payload = {
            ...formValue,
            date: this.helperService.setDate(formValue.date),
            items: formValue.items.map((item: any) => ({
                ...item,
                warrenty: this.globalHasWarrenty ? item.warrenty : null
            }))
        };

        if (this.mode === 'create') {
            delete payload.id;
            this.apiService.create(payload as CreateSellingBillDto).subscribe({
                next: () => this.onSave.emit()
            });
        } else {
            this.apiService.update({ id: this.id!, ...payload } as UpdateSellingBillDto).subscribe({
                next: () => this.onSave.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty && this.mode !== 'view') {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: 'Unsaved Changes',
                message: SellingBillConstants.MESSAGES.UNSAVED_CHANGES,
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.onClose.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.onClose.emit();
        }
    }
}
