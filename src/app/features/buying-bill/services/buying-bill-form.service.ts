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
            stocks: this.fb.array([], [Validators.required, Validators.minLength(1)]),
            expences: this.fb.array([])
        });
    }


    createItemForm(item?: any): FormGroup {
        return this.fb.group({
            id: [item?.id || 0],
            productId: [item?.productId || null, [Validators.required]],
            productName: [item?.productName || null], // For UI display
            quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
            purchasePrice: [item?.purchasePrice || null, [Validators.required, Validators.min(0.01)]],
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

    createExpenceForm(expence?: any): FormGroup {
        const form = this.fb.group({
            id: [expence?.id || 0],
            expenceType: [expence?.expenceType || null, [Validators.required, Validators.maxLength(250)]],
            totalAmount: [expence?.totalAmount || null, [Validators.required, Validators.min(0.01)]],
            payments: this.fb.array([])
        });

        if (expence && expence.payments && expence.payments.length > 0) {
            const paymentsArray = form.get('payments') as FormArray;
            expence.payments.forEach((p: any) => {
                paymentsArray.push(this.createPaymentForm(p));
            });
        }

        return form;
    }

    patchForm(form: FormGroup, data: BuyingBillDto): void {
        form.patchValue({
            id: data.id,
            billNo: data.billNo,
            agencyId: data.agencyId,
            date: new Date(data.date)
        });

        const stocksArray = form.get('stocks') as FormArray;
        stocksArray.clear();
        data.stocks.forEach(item => {
            stocksArray.push(this.createItemForm(item));
        });

        const expencesArray = form.get('expences') as FormArray;
        expencesArray.clear();
        data.expences.forEach(e => {
            expencesArray.push(this.createExpenceForm(e));
        });
    }

    addItem(form: FormGroup): void {
        const stocksArray = form.get('stocks') as FormArray;
        stocksArray.push(this.createItemForm());
    }

    removeItem(form: FormGroup, index: number): void {
        const stocksArray = form.get('stocks') as FormArray;
        stocksArray.removeAt(index);
        stocksArray.markAsDirty();
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

    addExpencePayment(expenceForm: FormGroup): void {
        const paymentsArray = expenceForm.get('payments') as FormArray;
        paymentsArray.push(this.createPaymentForm());
    }

    removeExpencePayment(expenceForm: FormGroup, paymentIndex: number): void {
        const paymentsArray = expenceForm.get('payments') as FormArray;
        paymentsArray.removeAt(paymentIndex);
        paymentsArray.markAsDirty();
    }
}
