import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BuyingBillItemSuggestionDto } from '../../models/buying-bill-item-suggestion.dto';
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

@Component({
    selector: 'app-buying-bill-form-dialog',
    standalone: false,
    templateUrl: './buying-bill-form-dialog.component.html'
})
export class BuyingBillFormDialogComponent implements OnChanges {
    private apiService = inject(BuyingBillApiService);
    private formService = inject(BuyingBillFormService);
    private dropdownService = inject(DropdownService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);
    private accountDetailsService = inject(AccountDetailsService);
    private downloadService = inject(BillDownloadService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    title = BuyingBillConstants.BUYING_BILL_TITLE;
    labels = BuyingBillConstants.LABELS;
    form!: FormGroup;

    agencyOptions: DropdownOption[] = [];
    paymentAccountOptions: DropdownOption[] = [];

    private isClosing = false;

    suggestions: BuyingBillItemSuggestionDto[] = [];
    filteredSuggestions: BuyingBillItemSuggestionDto[] = [];

    expenseTypeSuggestions: string[] = [];
    filteredExpenseTypeSuggestions: string[] = [];

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    get payments(): FormArray {
        return this.form.get('payments') as FormArray;
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
        return this.items.controls.reduce((acc, control) => {
            const price = control.get('price')?.value || 0;
            const quantity = control.get('quantity')?.value || 0;
            return acc + (price * quantity);
        }, 0);
    }

    get netAmount(): number {
        if (!this.form) return 0;
        const discount = this.form.get('discount')?.value || 0;
        return this.totalItemsAmount - discount;
    }

    get totalExpenceAmount(): number {
        if (!this.form) return 0;
        return this.expences.controls.reduce((acc, control) => {
            return acc + (control.get('amount')?.value || 0);
        }, 0);
    }

    get finalAmount(): number {
        return this.netAmount + this.totalExpenceAmount;
    }

    get totalPaidAmount(): number {
        if (!this.form) return 0;
        return this.payments.controls.reduce((acc, control) => {
            return acc + (control.get('amount')?.value || 0);
        }, 0);
    }

    get remainingAmount(): number {
        return this.finalAmount - this.totalPaidAmount;
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
                        if (this.mode === 'view') {
                            this.form.disable();
                        } else {
                            this.loadSuggestions(data.agencyId);
                        }
                    }
                });
            } else {
                this.addItem();
                this.loadSuggestions();
            }

            this.form.get('agencyId')?.valueChanges.subscribe(val => {
                this.loadSuggestions(val);
            });
        }
    }

    private loadSuggestions(agencyId?: number): void {
        if (this.mode != 'view' && this.accountDetailsService.enableSuggestions) {
            this.apiService.getItemSuggestions(agencyId).subscribe({
                next: (data) => this.suggestions = data
            });

            this.apiService.getExpenceTypeSuggestions().subscribe({
                next: (data) => this.expenseTypeSuggestions = data
            });
        }
    }

    searchItems(event: any): void {
        const query = (event.query || '').toLowerCase();
        this.filteredSuggestions = this.suggestions.filter(s =>
            s.itemName.toLowerCase().includes(query)
        );
    }

    searchExpenseTypes(event: any): void {
        const query = (event.query || '').toLowerCase();
        this.filteredExpenseTypeSuggestions = this.expenseTypeSuggestions.filter(s =>
            s.toLowerCase().includes(query)
        );
    }

    onSelectItem(event: any, index: number): void {
        const suggestion = event.value as BuyingBillItemSuggestionDto || event;
        const itemName = typeof suggestion === 'string' ? suggestion : suggestion.itemName;
        const price = typeof suggestion === 'string' ? null : suggestion.price;

        const itemForm = this.items.at(index);
        if (price !== null) {
            itemForm.patchValue({
                itemName: itemName,
                price: price
            });
        } else {
            itemForm.patchValue({
                itemName: itemName
            });
        }
    }

    onSelectExpenseType(event: any, index: number): void {
        const value = event.value || event;
        const expenseForm = this.expences.at(index);
        expenseForm.patchValue({ expenceType: value });
    }

    private loadOptions(): void {
        this.dropdownService.getAgencyOptions().subscribe({
            next: (options) => this.agencyOptions = options
        });
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => this.paymentAccountOptions = options
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

    addExpence(): void {
        this.formService.addExpence(this.form);
    }

    removeExpence(index: number): void {
        this.formService.removeExpence(this.form, index);
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
