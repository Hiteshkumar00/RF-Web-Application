import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const token = localStorage.getItem('accessToken');
    if (token && !authService.isTokenExpired(token)) {
        // Ensure session is initialized for role-based redirect
        if (!authService.currentUser) {
            authService.setAuthenticationToken(token);
        }

        const user = authService.currentUser;

        // If SuperAdmin has no accountID yet, send to account management
        if (user?.role === 'SuperAdmin' && (!user.accountId || user.accountId === '0')) {
            router.navigate(['/account-management']);
        } else {
            // Otherwise, send to dashboard (where adminGuard can still intervene if needed)
            router.navigate(['/dashboard']);
        }
        return false;
    }
    return true;
};
