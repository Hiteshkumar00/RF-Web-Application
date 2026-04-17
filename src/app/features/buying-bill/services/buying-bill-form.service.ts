import { Injectable, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuyingBillDto } from '../models/buying-bill.dto';

@Injectable({
    providedIn: 'root'
})
export class BuyingBillFormService {
    private fb = inject(FormBuilder);

    createForm(): FormGroup {
        return this.fb.group({
            id: [0],
            billNo: [null],
            agencyId: [null, [Validators.required]],
            date: [new Date(), [Validators.required]],
            discount: [0, [Validators.min(0)]],
            items: this.fb.array([], [Validators.required, Validators.minLength(1)]),
            payments: this.fb.array([]),
            expences: this.fb.array([])
        });
    }

    createItemForm(item?: any): FormGroup {
        return this.fb.group({
            id: [item?.id || 0],
            itemName: [item?.itemName || null, [Validators.required, Validators.maxLength(250)]],
            quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
            price: [item?.price || null, [Validators.required, Validators.min(0.01)]]
        });
    }

    createPaymentForm(payment?: any): FormGroup {
        return this.fb.group({
            id: [payment?.id || 0],
            amount: [payment?.amount || null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [payment?.paymentAccountId || null, [Validators.required]]
        });
    }

    createExpenceForm(expence?: any): FormGroup {
        return this.fb.group({
            id: [expence?.id || 0],
            expenceType: [expence?.expenceType || null, [Validators.required, Validators.maxLength(250)]],
            amount: [expence?.amount || null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [expence?.paymentAccountId || null, [Validators.required]]
        });
    }

    patchForm(form: FormGroup, data: BuyingBillDto): void {
        form.patchValue({
            id: data.id,
            billNo: data.billNo,
            agencyId: data.agencyId,
            date: new Date(data.date),
            discount: data.discount
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

        const expencesArray = form.get('expences') as FormArray;
        expencesArray.clear();
        data.expences.forEach(e => {
            expencesArray.push(this.createExpenceForm(e));
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

    addExpence(form: FormGroup): void {
        const expencesArray = form.get('expences') as FormArray;
        expencesArray.push(this.createExpenceForm());
    }

    removeExpence(form: FormGroup, index: number): void {
        const expencesArray = form.get('expences') as FormArray;
        expencesArray.removeAt(index);
        expencesArray.markAsDirty();
    }
}
