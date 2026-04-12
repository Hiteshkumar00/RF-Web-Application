import { Component, OnInit, inject } from '@angular/core';
import { AccountApiService } from '../../../account-management/services/account-api.service';
import { AccountDto } from '../../../account-management/models/account.model';
import { AccountLabels } from '../../../account-management/constants/account-labels.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { HeaderService } from '../../../../shared/services/header.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss'],
  standalone: false
})
export class AccountProfileComponent implements OnInit {
  private accountApiService = inject(AccountApiService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);

  labels = AccountLabels;
  account: AccountDto | null = null;
  isEditMode = false;
  isLoading = false;

  ngOnInit(): void {
    this.loadAccount();
  }

  private loadAccount(): void {
    // const routeId = this.route.snapshot.params['id'];
    const accountId = parseInt(this.authService.currentUser?.accountId || '0');

    if (!accountId) {
      if (!this.isLoading) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Account ID not found' });
      }
      return;
    }

    this.isLoading = true;
    this.accountApiService.getById(accountId).subscribe({
      next: (data) => {
        this.account = data;

        // Sync header title/logo
        this.headerService.setTitle(data.profileName);
        this.headerService.setLogo(data.profileLogoLink);

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load account details' });
      }
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onSaved(): void {
    this.isEditMode = false;
    this.loadAccount(); // Re-fetch data to reflect changes
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account details updated' });
  }
}
