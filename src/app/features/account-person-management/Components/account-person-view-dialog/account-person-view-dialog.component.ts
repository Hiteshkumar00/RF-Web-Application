import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountPersonDto } from '../../models/account-person.model';
import { AccountPersonLabels } from '../../constants/account-person-labels.constants';

@Component({
    selector: 'app-account-person-view-dialog',
    standalone: false,
    templateUrl: './account-person-view-dialog.component.html'
})
export class AccountPersonViewDialogComponent {
    @Input() visible = false;
    @Input() person: AccountPersonDto | null = null;

    @Output() closed = new EventEmitter<void>();

    labels = AccountPersonLabels;
}
