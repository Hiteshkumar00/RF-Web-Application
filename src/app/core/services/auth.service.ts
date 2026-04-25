import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
export interface User {
    id: string;
    email: string;
    role: string;
    accountId: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    get isSuperAdmin(): boolean {
        return this.currentUser?.role === 'SuperAdmin';
    }

    get hasAccount(): boolean {
        const id = this.currentUser?.accountId;
        return !!id && id !== '0' && id !== 'null';
    }

    /**
     * True if SuperAdmin and has NO account (Show SuperAdmin Menu / Access Account Management)
     */
    get isPureSuperAdmin(): boolean {
        return this.isSuperAdmin && !this.hasAccount;
    }

    /**
     * True if PureSuperAdmin AND UserId is -1
     */
    get isRootSuperAdmin(): boolean {
        return this.isPureSuperAdmin && this.currentUser?.id === '-1';
    }

    /**
     * True if Admin or SuperAdmin AND has a valid account (Show Main Menu / Access Dashboard)
     */
    get isAccountUser(): boolean {
        const role = this.currentUser?.role;
        const isAdminOrSuper = role === 'Admin' || role === 'SuperAdmin';
        return isAdminOrSuper && this.hasAccount;
    }

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private tokenExpirationTimer: any;

    private router = inject(Router);

    constructor() { }

    setAuthenticationToken(token: string) {
        if (!token || this.isTokenExpired(token)) {
            this.logout();
            return;
        }

        const user = this.decodeToken(token);
        if (user) {
            localStorage.setItem('accessToken', token);
            this.currentUserSubject.next(user);
            this.isLoggedInSubject.next(true);

            // Set expiration timer
            const payload = this.getTokenPayload(token);
            if (payload && payload.exp) {
                const expiresIn = (payload.exp * 1000) - new Date().getTime();
                this.handleTokenExpiry(expiresIn);
            }
        } else {
            this.logout();
        }
    }

    autoLogin() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            this.isLoggedInSubject.next(false);
            return;
        }

        if (this.isTokenExpired(token)) {
            this.logout();
            return;
        }

        this.setAuthenticationToken(token);
    }

    logout() {
        localStorage.removeItem('accessToken');
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.router.navigate(['/auth']);
    }

    public isTokenExpired(token: string): boolean {
        try {
            const payload = this.getTokenPayload(token);
            if (!payload || !payload.exp) return true;
            return (payload.exp * 1000) <= new Date().getTime();
        } catch {
            return true;
        }
    }

    private getTokenPayload(token: string): any {
        try {
            const part = token.split('.')[1];
            if (!part) return null;
            return JSON.parse(atob(part));
        } catch {
            return null;
        }
    }

    private handleTokenExpiry(expiresIn: number) {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn);
    }

    private decodeToken(token: string): User | null {
        try {
            const payload = this.getTokenPayload(token);
            if (!payload) return null;

            return {
                id: payload['nameid'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                email: payload['email'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                role: payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                accountId: payload['AccountId']
            };
        } catch (e) {
            console.error('Error decoding token:', e);
            return null;
        }
    }
}
