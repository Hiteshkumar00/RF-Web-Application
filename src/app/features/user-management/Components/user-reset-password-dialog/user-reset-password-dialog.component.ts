import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserApiService } from '../../Services/user-api.service';
import { UserLabels } from '../../constants/user-labels.constants';
import { UserMessages } from '../../constants/user-messages.constants';
import { UserDto } from '../../models/user.model';

@Component({
  selector: 'app-user-reset-password-dialog',
  standalone: false,
  templateUrl: './user-reset-password-dialog.component.html'
})
export class UserResetPasswordDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private userApiService = inject(UserApiService);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Input() user: UserDto | null = null;

  @Output() onClose = new EventEmitter<void>();

  labels = UserLabels;
  resetPasswordForm!: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue && this.user) {
      this.resetPasswordForm = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]]
      });
    }
  }

  submitResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    const dto = {
      userId: this.user!.id,
      newPassword: this.resetPasswordForm.value.newPassword
    };
    this.userApiService.resetPassword(dto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: UserMessages.PASSWORD_RESET });
        this.onClose.emit();
      }
    });
  }

  requestClose(): void {
    this.onClose.emit();
  }
}
