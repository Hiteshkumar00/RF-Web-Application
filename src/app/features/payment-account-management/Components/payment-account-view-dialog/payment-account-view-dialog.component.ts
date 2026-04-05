import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PaymentAccountDto } from '../../models/payment-account.model';
import { PaymentAccountLabels } from '../../constants/payment-account-labels.constants';
import { AccountPersonApiService } from '../../../account-person-management/Services/account-person-api.service';

@Component({
    selector: 'app-payment-account-view-dialog',
    templateUrl: './payment-account-view-dialog.component.html',
    standalone: false
})
export class PaymentAccountViewDialogComponent implements OnChanges {
    private accountPersonApiService = inject(AccountPersonApiService);

    @Input() visible = false;
    @Input() account: PaymentAccountDto | null = null;
    @Output() closed = new EventEmitter<void>();

    labels = PaymentAccountLabels;
    accountPersonName: string | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true && this.account?.accountPersonId) {
            this.fetchPersonName(this.account.accountPersonId);
        } else if (changes['visible']?.currentValue === false) {
            this.accountPersonName = null;
        }
    }

    private fetchPersonName(id: number): void {
        this.accountPersonApiService.getById(id).subscribe({
            next: (person) => {
                this.accountPersonName = person?.name ?? null;
            },
            error: () => {
                this.accountPersonName = null;
            }
        });
    }
}
