import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';

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
        private authService: AuthService
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
        this.authService.logout();
    }
}
