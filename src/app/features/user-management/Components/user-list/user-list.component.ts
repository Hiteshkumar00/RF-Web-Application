import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '../../Services/user-api.service';
import { UserDto } from '../../models/user.model';
import { UserLabels } from '../../constants/user-labels.constants';
import { UserMessages } from '../../constants/user-messages.constants';
import { UserTableColumns } from '../../constants/user-table.constants';

@Component({
    selector: 'app-user-list',
    standalone: false,
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    private userApiService = inject(UserApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    labels = UserLabels;
    columns = UserTableColumns.COLUMNS;
    users: UserDto[] = [];

    // Dialog control
    showFormDialog = false;
    showViewDialog = false;
    showResetPasswordDialog = false;
    formDialogMode: 'create' | 'update' = 'create';
    selectedUser: UserDto | null = null;

    resetPasswordForm!: FormGroup;

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userApiService.getAll().subscribe({
            next: (data) => this.users = data ?? []
        });
    }

    openCreateDialog(): void {
        this.selectedUser = null;
        this.formDialogMode = 'create';
        this.showFormDialog = true;
    }

    openEditDialog(user: UserDto): void {
        this.selectedUser = user;
        this.formDialogMode = 'update';
        this.showFormDialog = true;
    }

    openViewDialog(user: UserDto): void {
        this.selectedUser = user;
        this.showViewDialog = true;
    }

    onFormSaved(): void {
        this.showFormDialog = false;
        this.loadUsers();
        const msg = this.formDialogMode === 'create'
            ? UserMessages.CREATED
            : UserMessages.UPDATED;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
    }

    onFormDialogClosed(): void {
        this.showFormDialog = false;
    }

    confirmDelete(user: UserDto): void {
        this.confirmationService.confirm({
            header: this.labels.DELETE_CONFIRM_HEADER,
            message: this.labels.DELETE_CONFIRM_MESSAGE,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteUser(user.id)
        });
    }

    confirmToggleActive(user: UserDto): void {
        this.confirmationService.confirm({
            header: this.labels.TOGGLE_ACTIVE_CONFIRM_HEADER,
            message: this.labels.TOGGLE_ACTIVE_CONFIRM_MESSAGE,
            icon: 'pi pi-question-circle',
            acceptLabel: this.labels.YES,
            rejectLabel: this.labels.NO,
            acceptButtonStyleClass: user.isActive ? 'p-button-warning' : 'p-button-success',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.toggleActiveUser(user)
        });
    }

    openResetPasswordDialog(user: UserDto): void {
        this.selectedUser = user;
        this.resetPasswordForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]]
        });
        this.showResetPasswordDialog = true;
    }

    submitResetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }
        const dto = {
            userId: this.selectedUser!.id,
            newPassword: this.resetPasswordForm.value.newPassword
        };
        this.userApiService.resetPassword(dto).subscribe({
            next: () => {
                this.showResetPasswordDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: UserMessages.PASSWORD_RESET });
            }
        });
    }

    private deleteUser(id: number): void {
        this.userApiService.delete(id).subscribe({
            next: () => {
                this.loadUsers();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: UserMessages.DELETED });
            }
        });
    }

    private toggleActiveUser(user: UserDto): void {
        this.userApiService.activateDeactivate(user.id).subscribe({
            next: () => {
                this.loadUsers();
                const msg = user.isActive ? UserMessages.DEACTIVATED : UserMessages.ACTIVATED;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
            }
        });
    }
}
