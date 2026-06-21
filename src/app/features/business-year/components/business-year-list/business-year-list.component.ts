import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BusinessYearApiService } from '../../services/business-year-api.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { BusinessYearConstants } from '../../constants/business-year.constant';
import { BusinessYearListDto } from '../../models/business-year-list-dto.model';

import { BusinessYearDialogService } from '../../services/business-year-dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-business-year-list',
  standalone: false,
  templateUrl: './business-year-list.component.html',
  styleUrls: ['./business-year-list.component.css']
})
export class BusinessYearListComponent implements OnInit {
  years: BusinessYearListDto[] = [];
  labels = BusinessYearConstants;
  
  columns = [
    { field: 'yearName', header: this.labels.YEAR_NAME },
    { field: 'actions', header: this.labels.ACTIONS },
    { field: 'startDate', header: this.labels.START_DATE },
    { field: 'endDate', header: this.labels.END_DATE },
    { field: 'isSelected', header: this.labels.IS_SELECTED },
  ];

  constructor(
    private apiService: BusinessYearApiService,
    private confirmationService: ConfirmationService,
    public globalConfig: GlobalConfigService,
    private route: ActivatedRoute,
    private businessYearDialogService: BusinessYearDialogService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['data']) {
        this.years = data['data'];
      } else {
        this.loadYears();
      }
    });
  }

  loadYears(): void {
    this.apiService.getAll().subscribe({
      next: (res) => {
        this.years = res ?? [];
      }
    });
  }

  openCreateDialog(): void {
    this.businessYearDialogService.openForm('create', null, () => this.onFormSaved(), () => this.onFormDialogClosed());
  }

  openEditDialog(year: BusinessYearListDto): void {
    this.businessYearDialogService.openForm('edit', year, () => this.onFormSaved(), () => this.onFormDialogClosed());
  }

  onFormSaved(): void {
    this.loadYears();
    this.apiService.notifyBusinessYearChanged();
  }

  onFormDialogClosed(): void {
  }

  confirmDelete(year: BusinessYearListDto): void {
    this.confirmationService.confirm({
      header: this.labels.DELETE_HEADER,
      message: this.labels.DELETE_MESSAGE,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.apiService.delete(year.id).subscribe({
          next: (res) => {
            if (res) {
              this.loadYears();
              this.apiService.notifyBusinessYearChanged();
            }
          }
        });
      }
    });
  }

  confirmToggleSelected(year: BusinessYearListDto): void {
    if (year.isSelected) return; // already selected
    
    this.confirmationService.confirm({
      header: 'Change Business Year',
      message: `Are you sure you want to set ${year.yearName} as the active business year?`,
      icon: 'pi pi-info-circle',
      acceptLabel: 'Change',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.apiService.changeSelectedYear({ businessYearId: year.id }).subscribe({
          next: (res) => {
            if (res) {
              this.loadYears();
              this.apiService.notifyBusinessYearChanged();
            }
          }
        });
      }
    });
  }
}
