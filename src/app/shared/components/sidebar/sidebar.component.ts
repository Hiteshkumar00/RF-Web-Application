import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    items: MenuItem[] = [];
    superAdminItems: MenuItem[] = [];
    visible: boolean = false;

    constructor(
        private sidebarService: SidebarService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.sidebarService.sidebarVisible$.subscribe(isVisible => {
            this.visible = isVisible;
        });

        this.items = [
            {
                label: 'Menu 1',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/main-dashboard'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Menu 2',
                icon: 'pi pi-fw pi-star',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/inventory'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-video',
                        routerLink: ['/menu2/submenu2'],
                        routerLinkActiveOptions: { exact: true }
                    }
                ]
            },
            {
                label: 'Menu 3',
                icon: 'pi pi-fw pi-calendar',
                routerLink: ['/menu3'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Menu 4',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/menu4/submenu1'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-key',
                        routerLink: ['/menu4/submenu2'],
                        routerLinkActiveOptions: { exact: true }
                    }
                ]
            }
        ];

        this.superAdminItems = [
            {
                label: 'Account Management',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/account-management'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'User Management',
                icon: 'pi pi-fw pi-star',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        routerLink: ['/user-management'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-video',
                        routerLink: ['/user-management2'],
                        routerLinkActiveOptions: { exact: true }
                    }
                ]
            },
            {
                label: 'Entity Management',
                icon: 'pi pi-fw pi-database',
                routerLink: ['/entity'],
                routerLinkActiveOptions: { exact: true }
            }
        ];
    }

    get menuModel(): MenuItem[] {
        if (this.authService.isPureSuperAdmin) {
            return this.superAdminItems;
        }

        if (this.authService.isAccountUser) {
            return this.items;
        }

        return [];
    }

    onHide() {
        this.sidebarService.setSidebarVisible(false);
    }
}
