import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PaymentAccountApiService } from '../../Services/payment-account-api.service';
import { PaymentTransferFormService } from '../../Services/payment-transfer-form.service';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { HelperService } from '../../../../core/services/helper.service';
import { CreatePaymentTransfer, UpdatePaymentTransfer } from '../../models/payment-transfer.model';

@Component({
    selector: 'app-payment-transfer-form-dialog',
    standalone: false,
    templateUrl: './payment-transfer-form-dialog.component.html'
})
export class PaymentTransferFormDialogComponent implements OnChanges {
    private apiService = inject(PaymentAccountApiService);
    private formService = inject(PaymentTransferFormService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;
    @Input() accountOptions: DropdownOption[] = [];
    @Input() transferData: any;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    title = 'Payment Transfer';
    form!: FormGroup;
    private isClosing = false;

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return `${this.title}`;
            case 'update': return `Update ${this.title}`;
            case 'view': return `View ${this.title}`;
            default: return '';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.form = this.formService.createForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.transferData) {
                this.formService.patchForm(this.form, this.transferData);
                if (this.mode === 'view') {
                    this.form.disable();
                }
            }
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        const payload = {
            ...formValue,
            date: this.helperService.setDate(formValue.date)
        };

        if (this.mode === 'create') {
            delete payload.id;
            this.apiService.createTransfer(payload as CreatePaymentTransfer).subscribe({
                next: () => this.onSave.emit()
            });
        } else {
            this.apiService.updateTransfer({ id: this.id!, ...payload } as UpdatePaymentTransfer).subscribe({
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
                message: 'Are you sure you want to close without saving?',
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
