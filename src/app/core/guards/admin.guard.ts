import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Both Admin and SuperAdmin can access, but they MUST have a valid AccountId
    if (authService.isAccountUser) {
        return true;
    }

    // BREAK THE LOOP: Don't redirect to /auth if we are logged in but lack account info
    if (authService.isPureSuperAdmin) {
        router.navigate(['/account-management']);
    } else {
        authService.logout();
    }
    return false;
};
