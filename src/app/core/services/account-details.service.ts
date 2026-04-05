import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AccountApiService } from '../../features/account-management/services/account-api.service';
import { HeaderService } from '../../shared/services/header.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccountDetailsService {
    private authService = inject(AuthService);
    private accountApiService = inject(AccountApiService);
    private headerService = inject(HeaderService);

    private readonly defaultTitle = 'RF Application';
    private readonly defaultLogo = 'https://image2url.com/r2/default/images/1773590180920-3a186391-6a15-4289-8b28-223340a67f83.jpg';

    constructor() { }

    init() {
        this.authService.currentUser$.pipe(
            switchMap(user => {
                const accountId = user?.accountId;
                const isAccountUser = this.authService.isAccountUser;

                if (isAccountUser && accountId && accountId !== '0') {
                    return this.accountApiService.getById(parseInt(accountId));
                }

                // If not an account user, we can reset or skip
                return of(null);
            })
        ).subscribe(account => {
            if (account) {
                this.headerService.setTitle(account.profileName);
                if (account.profileLogoLink) {
                    this.headerService.setLogo(account.profileLogoLink);
                } else {
                    this.headerService.setLogo(this.defaultLogo);
                }
            } else {
                // Default values when not logged into an account
                this.headerService.setTitle(this.defaultTitle);
                this.headerService.setLogo(this.defaultLogo);
            }
        });
    }
}
