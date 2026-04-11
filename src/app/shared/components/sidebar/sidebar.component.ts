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
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: 'Summary',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/dashboard/business'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Payment',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/dashboard/payment'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Performance',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/dashboard/performance'],
                        routerLinkActiveOptions: { exact: true }
                    }
                ]
            },
            {
                label: 'Inventory',
                icon: 'pi pi-fw pi-box',
                routerLink: ['/inventory'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Expense',
                icon: 'pi pi-fw pi-receipt',
                routerLink: ['/expense'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Agency',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Management',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/agency/manage'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Advanced View',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/agency/advanced'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Person',
                        icon: 'pi pi-fw pi-user-plus',
                        routerLink: ['/agency/person'],
                        routerLinkActiveOptions: { exact: true }
                    }
                ]
            },
            {
                label: 'Payment Account',
                icon: 'pi pi-fw pi-wallet',
                routerLink: ['/payment-account-management'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Contribution',
                icon: 'pi pi-fw pi-money-bill',
                items: [
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/contribution/add'],
                        routerLinkActiveOptions: { exact: true }
                    },
                    {
                        label: 'Remove',
                        icon: 'pi pi-fw pi-minus',
                        routerLink: ['/contribution/remove'],
                        routerLinkActiveOptions: { exact: true }
                    }
                ]
            },
            {
                label: 'Account Person',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/account-person-management'],
                routerLinkActiveOptions: { exact: true }
            },
            {
                label: 'Business Year',
                icon: 'pi pi-fw pi-calendar-plus',
                routerLink: ['/business-year'],
                routerLinkActiveOptions: { exact: true }
            },
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
                routerLink: ['/user-management'],
                routerLinkActiveOptions: { exact: true }
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
