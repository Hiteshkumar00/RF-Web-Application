import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { UserApiService } from '../../Services/user-api.service';
import { UserFormService } from '../../Services/user-form.service';
import { UserDto } from '../../models/user.model';
import { UserLabels } from '../../constants/user-labels.constants';
import { CreateUserDto } from '../../models/user-create.dto';
import { UpdateUserDto } from '../../models/user-update.dto';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthApiService } from '../../../auth/services/auth-api.service';
import { Subscription } from 'rxjs';
import { DropdownService } from '../../../../shared/services/dropdown.service';

@Component({
    selector: 'app-user-form-dialog',
    standalone: false,
    templateUrl: './user-form-dialog.component.html'
})
export class UserFormDialogComponent implements OnChanges, OnDestroy {
    private userApiService = inject(UserApiService);
    private userFormService = inject(UserFormService);
    private confirmationService = inject(ConfirmationService);
    private authApiService = inject(AuthApiService);
    private authService = inject(AuthService);
    private dropdownService = inject(DropdownService);

    @Input() visible = false;
    @Input() mode: 'create' | 'update' = 'create';
    @Input() user: UserDto | null = null;

    @Output() saved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    labels = UserLabels;
    form!: FormGroup;
    roleOptions: DropdownOption[] = [];
    accountOptions: DropdownOption[] = [];
    private isClosing = false;
    private formSub?: Subscription;

    get dialogTitle(): string {
        return this.mode === 'create' ? this.labels.CREATE_DIALOG_TITLE : this.labels.UPDATE_DIALOG_TITLE;
    }

    get showAccountField(): boolean {
        return this.form?.get('role')?.value === 'Admin';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true) {
            this.isClosing = false;
            this.loadRoleOptions();
            this.loadAccountOptions();
            if (this.mode === 'create') {
                this.form = this.userFormService.createUserForm();
            } else {
                this.form = this.userFormService.createUpdateForm();
                if (this.user) {
                    this.userFormService.patchForm(this.form, this.user);
                }
            }
            // Match initial validation
            this.updateAccountValidator(this.form.get('role')?.value);

            // Watch role changes to hide account field and update validation
            this.formSub?.unsubscribe();
            this.formSub = this.form.get('role')?.valueChanges.subscribe((role) => {
                this.updateAccountValidator(role);
            });
        } else if (changes['visible']?.currentValue === false) {
            this.formSub?.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.formSub?.unsubscribe();
    }

    private loadRoleOptions(): void {
        this.authApiService.getUserRoleOptions().subscribe({
            next: (options) => this.roleOptions = options
        });
    }

    private loadAccountOptions(): void {
        this.dropdownService.getAccountOptions().subscribe({
            next: (options) => {
                this.accountOptions = options;
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.mode === 'create') {
            const dto: CreateUserDto = this.form.value;
            this.userApiService.create(dto).subscribe({
                next: () => this.saved.emit()
            });
        } else {
            const dto: UpdateUserDto = { id: this.user!.id, ...this.form.value };
            this.userApiService.update(dto).subscribe({
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
    private updateAccountValidator(role: string): void {
        const accountIdControl = this.form.get('accountId');
        if (role === 'Admin') {
            accountIdControl?.setValidators([Validators.required]);
        } else {
            accountIdControl?.clearValidators();
            accountIdControl?.setValue(null);
        }
        accountIdControl?.updateValueAndValidity();
    }
}
