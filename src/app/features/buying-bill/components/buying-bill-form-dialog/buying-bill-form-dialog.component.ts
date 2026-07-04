import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ProductApiService } from '../../../product/services/product-api.service';
import { ProductDialogService } from '../../../product/services/product-dialog.service';
import { ProductDto } from '../../../product/models/product.dto';
import { ConfirmationService } from 'primeng/api';
import { BuyingBillApiService } from '../../services/buying-bill-api.service';
import { BuyingBillFormService } from '../../services/buying-bill-form.service';
import { BuyingBillConstants } from '../../constants/buying-bill.constants';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { CreateBuyingBillDto } from '../../models/create-buying-bill.dto';
import { UpdateBuyingBillDto } from '../../models/update-buying-bill.dto';
import { HelperService } from '../../../../core/services/helper.service';
import { DropdownService } from '../../../../shared/services/dropdown.service';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { BillDownloadService } from '../../../../shared/services/bill-download.service';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared-module';

@Component({
    selector: 'app-buying-bill-form-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    templateUrl: './buying-bill-form-dialog.component.html'
})
export class BuyingBillFormDialogComponent implements OnChanges {
    private apiService = inject(BuyingBillApiService);
    private formService = inject(BuyingBillFormService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);
    private accountDetailsService = inject(AccountDetailsService);
    private downloadService = inject(BillDownloadService);
    private productDialogService = inject(ProductDialogService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    title = BuyingBillConstants.BUYING_BILL_TITLE;
    labels = BuyingBillConstants.LABELS;
    form!: FormGroup;

    @Input() agencyOptions: DropdownOption[] = [];
    @Input() paymentAccountOptions: DropdownOption[] = [];
    @Input() products: any[] = [];
    @Input() expenseTypeSuggestions: string[] = [];
    @Input() billDetails?: any;

    private isClosing = false;
    productOptions: any[] = [];
    filteredExpenseTypeSuggestions: string[] = [];
    expandedExpences: { [key: string]: boolean } = {};

    get stocks(): FormArray {
        return this.form.get('stocks') as FormArray;
    }

    get expences(): FormArray {
        return this.form.get('expences') as FormArray;
    }

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return `${this.title}`;
            case 'update': return `Update ${this.title} #${this.id}`;
            case 'view': return `View ${this.title} #${this.id}`;
            default: return '';
        }
    }

    get totalItemsAmount(): number {
        if (!this.form) return 0;
        return this.stocks.controls.reduce((acc, control) => {
            const price = control.get('purchasePrice')?.value || 0;
            const quantity = control.get('quantity')?.value || 0;
            return acc + (price * quantity);
        }, 0);
    }

    get totalDiscountAmount(): number {
        if (!this.form) return 0;
        return this.stocks.controls.reduce((acc, control) => {
            const discount = control.get('discount')?.value || 0;
            return acc + discount;
        }, 0);
    }

    get netAmount(): number {
        return this.totalItemsAmount - this.totalDiscountAmount;
    }

    get totalExpenceAmount(): number {
        if (!this.form) return 0;
        return this.expences.controls.reduce((acc, control) => {
            return acc + (control.get('totalAmount')?.value || 0);
        }, 0);
    }

    get totalExpencePaidAmount(): number {
        if (!this.form) return 0;
        return this.expences.controls.reduce((acc, control) => {
            const payments = control.get('payments') as FormArray;
            const paid = payments ? payments.controls.reduce((pAcc, pControl) => pAcc + (pControl.get('amount')?.value || 0), 0) : 0;
            return acc + paid;
        }, 0);
    }

    get totalExpenceRemainingAmount(): number {
        return this.totalExpenceAmount - this.totalExpencePaidAmount;
    }

    get finalAmount(): number {
        return this.netAmount;
    }



    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.form = this.formService.createForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.billDetails) {
                this.formService.patchForm(this.form, this.billDetails);
                if (this.mode === 'view') {
                    this.form.disable();
                }
            } else {
                this.addItem();
            }

            this.initProductOptions();
        }
    }

    private initProductOptions(): void {
        this.productOptions = (this.products || []).map(p => {
            const warrantyParts = [];
            if (p.warrantyYear) warrantyParts.push(`${p.warrantyYear}Y`);
            if (p.warrantyMonth) warrantyParts.push(`${p.warrantyMonth}M`);
            if (p.warrantyDay) warrantyParts.push(`${p.warrantyDay}D`);
            const warrantyStr = warrantyParts.join(' ');
            const label = warrantyStr ? `${p.productName} (🔰 ${warrantyStr})` : p.productName;
            return {
                label: label,
                value: p.id,
                data: p
            };
        });
    }

    openAddProductDialog(): void {
        this.productDialogService.openForm('create', undefined, () => this.onProductSave(), () => {});
    }

    onProductSave(): void {
        // Handled by parent
    }

    onProductChange(event: any, index: number): void {
        const productId = event.value;
        const option = this.productOptions.find(o => o.value === productId);
        if (option?.data) {
            const product = option.data;
            const itemForm = this.stocks.at(index);
            itemForm.patchValue({
                productId: product.id,
                productName: product.productName
            });
        }
    }

    getProductWarranty(productId: number): string | null {
        const option = this.productOptions.find(o => o.value === productId);
        if (!option?.data) return null;
        const p = option.data;
        const parts = [];
        if (p.warrantyYear) parts.push(`${p.warrantyYear}Y`);
        if (p.warrantyMonth) parts.push(`${p.warrantyMonth}M`);
        if (p.warrantyDay) parts.push(`${p.warrantyDay}D`);
        return parts.length > 0 ? parts.join(' ') : null;
    }




    searchExpenseTypes(event: any): void {
        const query = (event.query || '').toLowerCase();
        this.filteredExpenseTypeSuggestions = this.expenseTypeSuggestions.filter(s =>
            s.toLowerCase().includes(query)
        );
    }


    onSelectExpenseType(event: any, index: number): void {
        const value = event.value || event;
        const expenseForm = this.expences.at(index);
        expenseForm.patchValue({ expenceType: value });
    }



    addItem(): void {
        this.formService.addItem(this.form);
    }

    removeItem(index: number): void {
        this.formService.removeItem(this.form, index);
    }



    addExpence(): void {
        this.formService.addExpence(this.form);
    }

    removeExpence(index: number): void {
        this.formService.removeExpence(this.form, index);
    }

    getExpencePayments(expenceIndex: number): FormArray {
        return this.expences.at(expenceIndex).get('payments') as FormArray;
    }

    addExpencePayment(expenceIndex: number): void {
        this.formService.addExpencePayment(this.expences.at(expenceIndex) as FormGroup);
    }

    removeExpencePayment(expenceIndex: number, paymentIndex: number): void {
        this.formService.removeExpencePayment(this.expences.at(expenceIndex) as FormGroup, paymentIndex);
    }

    enableEditMode(): void {
        this.mode = 'update';
        this.form.enable();
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
            expences: formValue.expences.map((e: any) => ({
                ...e,
                payments: e.payments.map((p: any) => ({
                    ...p,
                    date: this.helperService.setDate(p.date)
                }))
            }))
        };

        if (this.mode === 'create') {
            delete payload.id;
            this.apiService.create(payload as CreateBuyingBillDto).subscribe({
                next: () => this.onSave.emit()
            });
        } else {
            this.apiService.update({ id: this.id!, ...payload } as UpdateBuyingBillDto).subscribe({
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
                message: BuyingBillConstants.MESSAGES.UNSAVED_CHANGES,
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

    downloadPdf(): void {
        if (!this.id) return;

        this.apiService.downloadInvoice(this.id).subscribe({
            next: (blob) => {
                const formValue = this.form.getRawValue();
                const fileName = `Purchase_Bill_${formValue.billNo || this.id}.pdf`;
                this.downloadService.downloadFile(blob, fileName);
            }
        });
    }
}
