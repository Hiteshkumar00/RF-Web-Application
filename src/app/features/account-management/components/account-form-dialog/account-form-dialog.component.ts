import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AccountApiService } from '../../services/account-api.service';
import { AccountFormService } from '../../services/account-form.service';
import { AccountDto } from '../../models/account.model';
import { AccountLabels } from '../../constants/account-labels.constants';
import { CreateAccountDto } from '../../models/account-create.dto';
import { UpdateAccountDto } from '../../models/account-update.dto';
import { EntityApiService } from '../../../entity/services/entity-api.service';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';

@Component({
    selector: 'app-account-form-dialog',
    standalone: false,
    templateUrl: './account-form-dialog.component.html'
})
export class AccountFormDialogComponent implements OnChanges {
    private accountApiService = inject(AccountApiService);
    private accountFormService = inject(AccountFormService);
    private confirmationService = inject(ConfirmationService);
    private entityApiService = inject(EntityApiService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' = 'create';
    @Input() account: AccountDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = AccountLabels;
    form!: FormGroup;
    currencyOptions: DropdownOption[] = [];
    private isClosing = false;

    get dialogTitle(): string {
        return this.mode === 'create' ? this.labels.CREATE_DIALOG_TITLE : this.labels.UPDATE_DIALOG_TITLE;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadCurrencyOptions();
            this.form = this.accountFormService.createAccountForm();
            if (this.mode === 'update' && this.account) {
                this.accountFormService.patchForm(this.form, this.account);
            }
        }
    }

    private loadCurrencyOptions(): void {
        this.entityApiService.getByEntityName('Currency').subscribe({
            next: (entity) => {
                if (entity.relatedEntities) {
                    this.currencyOptions = entity.relatedEntities.map(re => ({
                        label: `${re.relatedEntityName} (${re.relatedDisplayName})`,
                        value: re.relatedEntityName
                    }));
                }
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.mode === 'create') {
            const dto: CreateAccountDto = this.form.value;
            this.accountApiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdateAccountDto = { id: this.account!.id, ...this.form.value };
            this.accountApiService.update(dto).subscribe({
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
