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
    
    private _enableSuggestions = false;
    private _enableWhatsApp = false;
    private _enableAdvancedWhatsApp = false;
    private _enableEmail = false;
    private _enableVoiceTyping = false;
    private _dateFormat = 'dd-MMMM-yyyy';
    private _shortDateFormat = 'dd-MMM-yyyy';
    private accountSubscription?: any;

    private readonly defaultTitle = 'RF Application';
    private readonly defaultLogo = 'https://image2url.com/r2/default/images/1773590180920-3a186391-6a15-4289-8b28-223340a67f83.jpg';

    constructor() { }

    get enableSuggestions(): boolean {
        return this._enableSuggestions;
    }

    get enableWhatsApp(): boolean {
        return this._enableWhatsApp;
    }

    get enableAdvancedWhatsApp(): boolean {
        return this._enableAdvancedWhatsApp;
    }

    get enableEmail(): boolean {
        return this._enableEmail;
    }

    get enableVoiceTyping(): boolean {
        return this._enableVoiceTyping;
    }

    get dateFormat(): string {
        return this._dateFormat;
    }

    get shortDateFormat(): string {
        return this._shortDateFormat;
    }

    init() {
        if (this.accountSubscription) return; // Already initialized

        this.accountSubscription = this.authService.currentUser$.pipe(
            switchMap(user => {
                const accountId = user?.accountId;
                const isAccountUser = this.authService.isAccountUser;

                if (isAccountUser && accountId && accountId !== '0') {
                    return this.accountApiService.getById(parseInt(accountId));
                }

                return of(null);
            })
        ).subscribe(account => this.updateState(account));
    }

    refresh() {
        const user = this.authService.currentUser;
        const accountId = user?.accountId;
        if (accountId && accountId !== '0') {
            this.accountApiService.getById(parseInt(accountId)).subscribe(account => this.updateState(account));
        }
    }

    private updateState(account: any) {
        if (account) {
            this._enableSuggestions = account.enableSuggestions;
            this._enableWhatsApp = account.enableWhatsApp;
            this._enableAdvancedWhatsApp = account.enableAdvancedWhatsApp;
            this._enableEmail = account.enableEmail;
            this._enableVoiceTyping = account.enableVoiceTyping;
            this._dateFormat = account.dateFormat || 'dd-MMMM-yyyy';
            this._shortDateFormat = account.shortDateFormat || 'dd-MMM-yyyy';
            
            this.headerService.setTitle(account.profileName);
            if (account.profileLogoLink) {
                this.headerService.setLogo(account.profileLogoLink);
            } else {
                this.headerService.setLogo(this.defaultLogo);
            }
        } else {
            this._dateFormat = 'dd-MMMM-yyyy';
            this._shortDateFormat = 'dd-MMM-yyyy';
            this.headerService.setTitle(this.defaultTitle);
            this.headerService.setLogo(this.defaultLogo);
        }
    }
}
