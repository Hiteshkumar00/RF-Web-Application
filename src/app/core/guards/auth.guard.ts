import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = localStorage.getItem('accessToken');
    if (!token || authService.isTokenExpired(token)) {
        authService.logout();
        return false;
    }

    // Ensure session is initialized in service if not already (important for page refresh)
    if (!authService.currentUser) {
        authService.setAuthenticationToken(token);
    }

    return true;
};
