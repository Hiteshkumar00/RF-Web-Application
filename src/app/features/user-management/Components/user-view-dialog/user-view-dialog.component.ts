import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../models/user.model';
import { UserLabels } from '../../constants/user-labels.constants';

@Component({
    selector: 'app-user-view-dialog',
    standalone: false,
    templateUrl: './user-view-dialog.component.html'
})
export class UserViewDialogComponent {
    @Input() visible = false;
    @Input() user: UserDto | null = null;

    @Output() closed = new EventEmitter<void>();

    labels = UserLabels;
}
