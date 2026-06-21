import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ProductApiService } from '../../../product/services/product-api.service';
import { ProductDialogService } from '../../../product/services/product-dialog.service';
import { ProductDto } from '../../../product/models/product.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SellingBillApiService } from '../../services/selling-bill-api.service';
import { SellingBillFormService } from '../../services/selling-bill-form.service';
import { SellingBillConstants } from '../../constants/selling-bill.constants';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { CreateSellingBillDto } from '../../models/create-selling-bill.dto';
import { UpdateSellingBillDto } from '../../models/update-selling-bill.dto';
import { HelperService } from '../../../../core/services/helper.service';
import { CustomerListDto } from '../../../customer/models/customer.model';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { BillDownloadService } from '../../../../shared/services/bill-download.service';
import { WhatsAppService } from '../../../../shared/services/whatsapp.service';
import { EmailService } from '../../../../shared/services/email.service';

@Component({
    selector: 'app-selling-bill-form-dialog',
    standalone: false,
    templateUrl: './selling-bill-form-dialog.component.html'
})
export class SellingBillFormDialogComponent implements OnChanges {
    private apiService = inject(SellingBillApiService);
    private formService = inject(SellingBillFormService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private helperService = inject(HelperService);
    private accountDetailsService = inject(AccountDetailsService);
    private downloadService = inject(BillDownloadService);
    private whatsAppService = inject(WhatsAppService);
    private emailService = inject(EmailService);
    private productDialogService = inject(ProductDialogService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    title = SellingBillConstants.SELLING_BILL_TITLE;
    labels = SellingBillConstants.LABELS;
    form!: FormGroup;
    @Input() accountOptions: DropdownOption[] = [];
    @Input() products: any[] = [];
    @Input() allCustomers: CustomerListDto[] = [];
    @Input() billDetails?: any;
    private isClosing = false;

    productOptions: any[] = [];
    customerOptions: any[] = [];
    isNewCustomer = true;

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

    get totalDiscount(): number {
        if (!this.form) return 0;
        return this.items.controls.reduce((acc, control) => {
            const discount = control.get('discount')?.value || 0;
            return acc + discount;
        }, 0);
    }

    get finalAmount(): number {
        return this.totalAmount - this.totalDiscount;
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

    get canSendWhatsApp(): boolean {
        return this.accountDetailsService.enableWhatsApp;
    }

    get canSendEmail(): boolean {
        return this.accountDetailsService.enableEmail;
    }

    get canAutoSendWhatsApp(): boolean {
        return this.accountDetailsService.enableAdvancedWhatsApp;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.form = this.formService.createForm();
            
            this.customerOptions = this.allCustomers.map(c => ({
                label: c.customerName + (c.phoneNo ? ` (${c.phoneNo})` : ''),
                value: c.id
            }));

            if ((this.mode === 'update' || this.mode === 'view') && this.billDetails) {
                this.isNewCustomer = !this.billDetails.customerId;
                this.formService.patchForm(this.form, this.billDetails);
                this.onToggleCustomerMode(this.isNewCustomer);
                if (this.mode === 'view') {
                    this.form.disable();
                }
            } else {
                this.isNewCustomer = true;
                this.onToggleCustomerMode(true);
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
        // Product reload will be handled by the parent component or the next open instance,
        // since the component should be re-instantiated. For now, we do nothing as the parent 
        // doesn't refresh the inputs dynamically.
    }




    onProductChange(event: any, index: number): void {
        const productId = event.value;
        const option = this.productOptions.find(o => o.value === productId);
        if (option?.data) {
            const product = option.data;
            const itemForm = this.items.at(index);
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


    onCustomerChange(event: any): void {
        const customerId = event.value;
        const customer = this.allCustomers.find(c => c.id === customerId);
        if (customer) {
            this.form.patchValue({
                customerName: customer.customerName,
                phoneNo: customer.phoneNo || '',
                email: customer.email || '',
                address: customer.address || ''
            });
        }
    }

    onToggleCustomerMode(isNew: boolean): void {
        this.isNewCustomer = isNew;
        const nameControl = this.form.get('customerName');
        const idControl = this.form.get('customerId');
        
        if (isNew) {
            nameControl?.setValidators([Validators.required, Validators.maxLength(250)]);
            idControl?.clearValidators();
        } else {
            nameControl?.clearValidators();
            idControl?.setValidators([Validators.required]);
        }
        
        nameControl?.updateValueAndValidity();
        idControl?.updateValueAndValidity();

        if (this.mode === 'view') {
            this.form.disable();
            return;
        }

        const controls = ['customerName', 'phoneNo', 'email', 'address'];
        if (isNew) {
            this.form.patchValue({ customerId: null });
            controls.forEach(c => this.form.get(c)?.enable());
        } else {
            controls.forEach(c => this.form.get(c)?.disable());
            const currentId = this.form.get('customerId')?.value;
            if (currentId) {
                const customer = this.allCustomers.find(cust => cust.id === currentId);
                if (customer) {
                    this.form.patchValue({
                        customerName: customer.customerName,
                        phoneNo: customer.phoneNo || '',
                        email: customer.email || '',
                        address: customer.address || ''
                    });
                }
            }
        }
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
            payments: formValue.payments.map((p: any) => ({
                ...p,
                date: this.helperService.setDate(p.date)
            }))
        };

        if (this.mode === 'create') {
            delete payload.id;
            this.apiService.create(payload as CreateSellingBillDto).subscribe({
                next: (res: any) => {
                    const actualId = (typeof res === 'number') ? res : (res?.data || res?.id || this.id);
                    if (actualId) {
                        this.handleAutoSend(actualId, formValue);
                    }
                    this.onSave.emit();
                }
            });
        } else {
            this.apiService.update({ id: this.id!, ...payload } as UpdateSellingBillDto).subscribe({
                next: () => {
                    this.handleAutoSend(this.id!, formValue);
                    this.onSave.emit();
                }
            });
        }
    }

    private handleAutoSend(id: number, formValue: any): void {
        if (formValue.sendEmail) {
            this.apiService.sendEmailMessage(id).subscribe({
                next: () => this.messageService.add({ severity: 'success', summary: 'Auto-Send', detail: 'Bill sent via Email' }),
                error: () => this.messageService.add({ severity: 'error', summary: 'Email Error', detail: 'Failed to auto-send email' })
            });
        }
        if (formValue.sendWhatsApp && this.canAutoSendWhatsApp) {
            this.apiService.sendWhatsAppMessage(id).subscribe({
                next: () => this.messageService.add({ severity: 'success', summary: 'Auto-Send', detail: 'Bill sent via WhatsApp API' }),
                error: () => this.messageService.add({ severity: 'error', summary: 'WhatsApp Error', detail: 'Failed to auto-send WhatsApp' })
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

    downloadPdf(): void {
        if (!this.id) return;

        this.apiService.downloadInvoice(this.id).subscribe({
            next: (blob) => {
                const formValue = this.form.getRawValue();
                const dateStr = this.helperService.setDate(formValue.date);
                const fileName = `Bill_${formValue.billNo || this.id}_${dateStr}_${formValue.customerName}.pdf`;
                this.downloadService.downloadFile(blob, fileName);
            }
        });
    }

    sendWhatsApp(): void {
        const formValue = this.form.getRawValue();
        const billData = {
            ...formValue,
            date: this.helperService.setDate(formValue.date),
            netAmount: this.finalAmount,
            paidAmount: this.paidAmount,
            remainingAmount: this.remainingAmount,
            id: this.id
        };

        if (this.id) {
            this.apiService.downloadInvoice(this.id).subscribe({
                next: (blob) => {
                    const dateStr = this.helperService.setDate(formValue.date);
                    const fileName = `Bill_${formValue.billNo || this.id}_${dateStr}_${formValue.customerName}.pdf`;
                    this.whatsAppService.sendBillOnWhatsApp(billData, blob, fileName);
                },
                error: () => {
                    this.whatsAppService.sendBillOnWhatsApp(billData);
                }
            });
        } else {
            this.whatsAppService.sendBillOnWhatsApp(billData);
        }
    }

    sendEmail(): void {
        const formValue = this.form.getRawValue();
        const billData = {
            ...formValue,
            date: this.helperService.setDate(formValue.date),
            netAmount: this.finalAmount,
            paidAmount: this.paidAmount,
            remainingAmount: this.remainingAmount,
            id: this.id
        };
        this.emailService.sendBillOnEmail(billData);
    }
}
