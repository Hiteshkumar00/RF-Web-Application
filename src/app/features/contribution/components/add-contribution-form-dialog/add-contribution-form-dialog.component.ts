import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AddContributionApiService } from '../../services/add-contribution-api.service';
import { ContributionFormService } from '../../services/contribution-form.service';
import { ContributionConstants } from '../../constants/contribution.constants';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { CreateAddContributionDto, UpdateAddContributionDto } from '../../models/add-contribution.model';
import { HelperService } from '../../../../core/services/helper.service';
import { DropdownService } from '../../../../shared/services/dropdown.service';

@Component({
    selector: 'app-add-contribution-form-dialog',
    standalone: false,
    templateUrl: './add-contribution-form-dialog.component.html'
})
export class AddContributionFormDialogComponent implements OnChanges {
    private apiService = inject(AddContributionApiService);
    private formService = inject(ContributionFormService);
    private dropdownService = inject(DropdownService);
    private confirmationService = inject(ConfirmationService);
    private helperService = inject(HelperService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' | 'view' = 'create';
    @Input() id?: number;

    @Output() onSave = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    title = ContributionConstants.ADD_CONTRIBUTION_TITLE;
    form!: FormGroup;
    personOptions: DropdownOption[] = [];
    accountOptions: DropdownOption[] = [];
    private isClosing = false;

    get payments(): FormArray {
        return this.form.get('payments') as FormArray;
    }

    get dialogTitle(): string {
        switch (this.mode) {
            case 'create': return `Add ${this.title}`;
            case 'update': return `Update ${this.title}`;
            case 'view': return `View ${this.title}`;
            default: return '';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadOptions();
            this.form = this.formService.createForm();

            if ((this.mode === 'update' || this.mode === 'view') && this.id) {
                this.apiService.getById(this.id).subscribe({
                    next: (data) => {
                        this.formService.patchForm(this.form, data);
                        if (this.mode === 'view') {
                            this.form.disable();
                        }
                    }
                });
            } else {
                this.addPayment();
            }
        }
    }

    private loadOptions(): void {
        this.dropdownService.getAccountPersonOptions().subscribe({
            next: (options) => this.personOptions = options
        });
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => this.accountOptions = options
        });
    }

    addPayment(): void {
        this.formService.addPayment(this.form);
    }

    removePayment(index: number): void {
        this.formService.removePayment(this.form, index);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();
        const payload = {
            ...formValue,
            date: this.helperService.setDate(formValue.date)
        };

        if (this.mode === 'create') {
            delete payload.id;
            this.apiService.create(payload as CreateAddContributionDto).subscribe({
                next: () => this.onSave.emit()
            });
        } else {
            this.apiService.update({ id: this.id!, ...payload } as UpdateAddContributionDto).subscribe({
                next: () => this.onSave.emit()
            });
        }
    }

    requestClose(): void {
        if (this.isClosing) return;

        if (this.form?.dirty && this.mode !== 'view') {
            this.isClosing = true;
            this.confirmationService.confirm({
                header: 'Unsaved Changes',
                message: ContributionConstants.MESSAGES.UNSAVED_CHANGES,
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-warning',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    this.isClosing = false;
                    this.onClose.emit();
                },
                reject: () => {
                    this.isClosing = false;
                }
            });
        } else {
            this.onClose.emit();
        }
    }
}
