import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    logo$!: Observable<string>;
    title$!: Observable<string>;
    isLoggedIn$!: Observable<boolean>;

    constructor(
        private headerService: HeaderService,
        private sidebarService: SidebarService,
        private authService: AuthService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.logo$ = this.headerService.logo$;
        this.title$ = this.headerService.title$;
        this.isLoggedIn$ = this.authService.isLoggedIn$;
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar();
    }

    logout() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to logout?',
            header: 'Logout Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Logout',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text p-button-secondary',
            accept: () => {
                this.authService.logout();
            }
        });
    }
}
