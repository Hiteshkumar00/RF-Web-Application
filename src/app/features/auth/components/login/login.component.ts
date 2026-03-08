import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthFormService } from '../../services/auth-form.service';
import { AuthMessages, AuthLabels } from '../../constants/auth.constants';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private authFormService = inject(AuthFormService);
    private authService = inject(AuthService);
    private authApiService = inject(AuthApiService);
    private router = inject(Router);

    loginForm: FormGroup = this.authFormService.createLoginForm();
    labels = AuthLabels;

    onSubmit() {
        if (this.loginForm.invalid) return;

        this.authApiService.login(this.loginForm.value).subscribe({
            next: (res) => {
                this.authService.setAuthenticationToken(res);
                this.router.navigate(['/main-dashboard']);
            }
        });
    }
}
