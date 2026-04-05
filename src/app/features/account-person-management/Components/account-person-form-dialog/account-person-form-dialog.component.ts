import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AccountPersonApiService } from '../../Services/account-person-api.service';
import { AccountPersonFormService } from '../../Services/account-person-form.service';
import { AccountPersonDto } from '../../models/account-person.model';
import { AccountPersonLabels } from '../../constants/account-person-labels.constants';
import { CreateAccountPersonDto } from '../../models/account-person-create.dto';
import { UpdateAccountPersonDto } from '../../models/account-person-update.dto';

@Component({
    selector: 'app-account-person-form-dialog',
    standalone: false,
    templateUrl: './account-person-form-dialog.component.html'
})
export class AccountPersonFormDialogComponent implements OnChanges {
    private apiService = inject(AccountPersonApiService);
    private formService = inject(AccountPersonFormService);
    private confirmationService = inject(ConfirmationService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' = 'create';
    @Input() person: AccountPersonDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = AccountPersonLabels;
    form!: FormGroup;
    private isClosing = false;

    get dialogTitle(): string {
        return this.mode === 'create' ? this.labels.CREATE_DIALOG_TITLE : this.labels.UPDATE_DIALOG_TITLE;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.form = this.formService.createForm();
            if (this.mode === 'update' && this.person) {
                this.formService.patchForm(this.form, this.person);
            }
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.mode === 'create') {
            const dto: CreateAccountPersonDto = this.form.value;
            this.apiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdateAccountPersonDto = this.form.value;
            this.apiService.update(dto).subscribe({
                next: () => this.saved.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty) {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: this.labels.UNSAVED_CONFIRM_HEADER,
                message: this.labels.UNSAVED_CONFIRM_MESSAGE,
                icon: 'pi pi-exclamation-circle',
                acceptLabel: this.labels.YES,
                rejectLabel: this.labels.NO,
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.closed.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.closed.emit();
        }
    }
}
