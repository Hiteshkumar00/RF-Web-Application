import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    logo$!: Observable<string>;
    title$!: Observable<string>;

    constructor(
        private headerService: HeaderService,
        private sidebarService: SidebarService
    ) { }

    ngOnInit() {
        this.logo$ = this.headerService.logo$;
        this.title$ = this.headerService.title$;
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar();
    }

    logout() {
        console.log('Logout clicked');
        // Implement actual logout logic here
    }
}
