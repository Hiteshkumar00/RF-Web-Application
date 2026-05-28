import { Injectable, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellingBillDetailsDto } from '../models/selling-bill.model';

@Injectable({
    providedIn: 'root'
})
export class SellingBillFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            id: [0],
            billNo: [null],
            customerName: [null, [Validators.required, Validators.maxLength(250)]],
            email: [null, [Validators.email, Validators.maxLength(250)]],
            phoneNo: [null, [Validators.maxLength(20)]],
            address: [null, [Validators.maxLength(500)]],
            date: [new Date(), [Validators.required]],
            items: this.fb.array([], [Validators.required, Validators.minLength(1)]),
            payments: this.fb.array([]),
            sendEmail: [false],
            sendWhatsApp: [false]
        });
    }

    createItemForm(item?: any): FormGroup {
        return this.fb.group({
            id: [item?.id || 0],
            productId: [item?.productId || null, [Validators.required]],
            productName: [item?.productName || null], // For UI display
            quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
            price: [item?.price || null, [Validators.required, Validators.min(0.01)]],
            discount: [item?.discount || 0, [Validators.min(0)]]
        });
    }

    createPaymentForm(payment?: any): FormGroup {
        return this.fb.group({
            id: [payment?.id || 0],
            amount: [payment?.amount || null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [payment?.paymentAccountId || null, [Validators.required]],
            date: [payment?.date ? new Date(payment.date) : null]
        });
    }

    patchForm(form: FormGroup, data: SellingBillDetailsDto): void {
        form.patchValue({
            id: data.id,
            billNo: data.billNo,
            customerName: data.customerName,
            email: data.email,
            phoneNo: data.phoneNo,
            address: data.address,
            date: new Date(data.date)
        });

        const itemsArray = form.get('items') as FormArray;
        itemsArray.clear();
        data.items.forEach(item => {
            itemsArray.push(this.createItemForm(item));
        });

        const paymentsArray = form.get('payments') as FormArray;
        paymentsArray.clear();
        data.payments.forEach(p => {
            paymentsArray.push(this.createPaymentForm(p));
        });
    }

    addItem(form: FormGroup): void {
        const itemsArray = form.get('items') as FormArray;
        itemsArray.push(this.createItemForm());
    }

    removeItem(form: FormGroup, index: number): void {
        const itemsArray = form.get('items') as FormArray;
        itemsArray.removeAt(index);
        itemsArray.markAsDirty();
    }

    addPayment(form: FormGroup): void {
        const paymentsArray = form.get('payments') as FormArray;
        paymentsArray.push(this.createPaymentForm());
    }

    removePayment(form: FormGroup, index: number): void {
        const paymentsArray = form.get('payments') as FormArray;
        paymentsArray.removeAt(index);
        paymentsArray.markAsDirty();
    }
}
