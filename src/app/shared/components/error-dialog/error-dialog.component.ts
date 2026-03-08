import { Component, inject } from '@angular/core';
import { ErrorDialogService } from '../../../core/services/error-dialog.service';

@Component({
    selector: 'app-error-dialog',
    standalone: false,
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {
    errorService = inject(ErrorDialogService);
}
