import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountDto } from '../../models/account.model';
import { AccountLabels } from '../../constants/account-labels.constants';

@Component({
    selector: 'app-account-view-dialog',
    standalone: false,
    templateUrl: './account-view-dialog.component.html'
})
export class AccountViewDialogComponent {
    @Input() visible = false;
    @Input() account: AccountDto | null = null;
    @Output() closed = new EventEmitter<void>();

    labels = AccountLabels;
}
