import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { BusinessYearApiService } from '../../../features/business-year/services/business-year-api.service';
import { BusinessYearListDto } from '../../../features/business-year/models/business-year-list-dto.model';
import { Router } from '@angular/router';
import { ChangeUserSelectedYearDto } from '../../../features/business-year/models/change-user-selected-year-dto.model';

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
    isAccountUser: boolean = false;

    years: BusinessYearListDto[] = [];
    selectedYearId: number | null = null;
    previousYearId: number | null = null;

    get selectedYear(): BusinessYearListDto | undefined {
        return this.years.find(y => y.id === this.selectedYearId);
    }

    constructor(
        private headerService: HeaderService,
        private sidebarService: SidebarService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private businessYearApiService: BusinessYearApiService,
        private router: Router
    ) { }

    ngOnInit() {
        this.logo$ = this.headerService.logo$;
        this.title$ = this.headerService.title$;
        this.isLoggedIn$ = this.authService.isLoggedIn$;

        this.authService.currentUser$.subscribe(() => {
            this.isAccountUser = this.authService.isAccountUser;
            if (this.isAccountUser) {
                this.loadYears();
            }
        });
    }

    loadYears() {
        this.businessYearApiService.getAll().subscribe(years => {
            this.years = years;
            const selected = years.find(y => y.isSelected);
            if (selected) {
                this.selectedYearId = selected.id;
                this.previousYearId = selected.id;
            }
        });
    }

    onYearChange() {
        if (!this.selectedYearId || this.selectedYearId === this.previousYearId) return;

        const selectedYear = this.years.find(y => y.id === this.selectedYearId);

        this.confirmationService.confirm({
            message: `Are you sure you want to change the Business Year to ${selectedYear?.yearName}?`,
            header: 'Change Business Year',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Change',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-text p-button-secondary',
            accept: () => {
                const dto = new ChangeUserSelectedYearDto();
                dto.businessYearId = this.selectedYearId!;
                this.businessYearApiService.changeSelectedYear(dto).subscribe(() => {
                    this.router.navigate(['/dashboard']).then(() => {
                        window.location.reload();
                    });
                });
            },
            reject: () => {
                this.selectedYearId = this.previousYearId;
            }
        });
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
