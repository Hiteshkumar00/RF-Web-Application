import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PaymentAccountApiService } from '../../Services/payment-account-api.service';
import { PaymentAccountFormService } from '../../Services/payment-account-form.service';
import { PaymentAccountDto } from '../../models/payment-account.model';
import { PaymentAccountLabels } from '../../constants/payment-account-labels.constants';
import { CreatePaymentAccountDto } from '../../models/create-payment-account.dto';
import { UpdatePaymentAccountDto } from '../../models/update-payment-account.dto';
import { AccountPersonApiService } from '../../../account-person-management/Services/account-person-api.service';

@Component({
    selector: 'app-payment-account-form-dialog',
    templateUrl: './payment-account-form-dialog.component.html',
    standalone: false
})
export class PaymentAccountFormDialogComponent implements OnChanges {
    private paymentAccountApiService = inject(PaymentAccountApiService);
    private paymentAccountFormService = inject(PaymentAccountFormService);
    private confirmationService = inject(ConfirmationService);
    private accountPersonApiService = inject(AccountPersonApiService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' = 'create';
    @Input() account: PaymentAccountDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = PaymentAccountLabels;
    form!: FormGroup;
    personOptions: { label: string, value: number }[] = [];
    private isClosing = false;

    get dialogTitle(): string {
        return this.mode === 'create' ? this.labels.ADD_PAYMENT_ACCOUNT : this.labels.EDIT_PAYMENT_ACCOUNT;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadPersonOptions();
            this.form = this.paymentAccountFormService.createForm();
            if (this.mode === 'update' && this.account) {
                this.paymentAccountFormService.patchForm(this.form, this.account);
            }
        }
    }

    private loadPersonOptions(): void {
        this.accountPersonApiService.getAll().subscribe({
            next: (persons) => {
                this.personOptions = (persons ?? []).map(p => ({
                    label: p.name,
                    value: p.id
                }));
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const data = this.form.value;
        if (this.mode === 'create') {
            const dto: CreatePaymentAccountDto = {
                methodName: data.methodName,
                accountPersonId: data.accountPersonId
            };
            this.paymentAccountApiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdatePaymentAccountDto = {
                id: this.account!.id,
                methodName: data.methodName,
                accountPersonId: data.accountPersonId
            };
            this.paymentAccountApiService.update(dto).subscribe({
                next: () => this.saved.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty) {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: this.labels.UNSAVED_CHANGES_HEADER,
                message: this.labels.UNSAVED_CHANGES_MESSAGE,
                icon: 'pi pi-exclamation-circle',
                acceptLabel: this.labels.YES,
                rejectLabel: this.labels.NO,
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.closed.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.closed.emit();
        }
    }
}
