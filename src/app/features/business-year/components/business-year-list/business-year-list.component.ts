import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BusinessYearApiService } from '../../services/business-year-api.service';
import { BusinessYearConstants } from '../../constants/business-year.constant';
import { BusinessYearListDto } from '../../models/business-year-list-dto.model';

@Component({
  selector: 'app-business-year-list',
  standalone: false,
  templateUrl: './business-year-list.component.html',
  styleUrls: ['./business-year-list.component.css']
})
export class BusinessYearListComponent implements OnInit {
  years: BusinessYearListDto[] = [];
  labels = BusinessYearConstants;

  showFormDialog = false;
  formDialogMode: 'create' | 'edit' = 'create';
  selectedYear: BusinessYearListDto | null = null;
  
  columns = [
    { field: 'yearName', header: this.labels.YEAR_NAME },
    { field: 'actions', header: this.labels.ACTIONS },
    { field: 'startDate', header: this.labels.START_DATE },
    { field: 'endDate', header: this.labels.END_DATE },
    { field: 'isSelected', header: this.labels.IS_SELECTED },
  ];

  constructor(
    private apiService: BusinessYearApiService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadYears();
  }

  loadYears(): void {
    this.apiService.getAll().subscribe({
      next: (res) => {
        this.years = res ?? [];
      }
    });
  }

  openCreateDialog(): void {
    this.selectedYear = null;
    this.formDialogMode = 'create';
    this.showFormDialog = true;
  }

  openEditDialog(year: BusinessYearListDto): void {
    this.selectedYear = year;
    this.formDialogMode = 'edit';
    this.showFormDialog = true;
  }

  confirmDelete(year: BusinessYearListDto): void {
    this.confirmationService.confirm({
      header: this.labels.DELETE_HEADER,
      message: this.labels.DELETE_MESSAGE,
      icon: 'pi pi-exclamation-triangle',
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
    this.apiService.changeSelectedYear({ businessYearId: year.id }).subscribe({
      next: (res) => {
        if (res) {
          this.loadYears();
          this.apiService.notifyBusinessYearChanged();
        }
      }
    });
  }

  onFormSaved(): void {
    this.showFormDialog = false;
    this.loadYears();
    this.apiService.notifyBusinessYearChanged();
  }

  onFormDialogClosed(): void {
    this.showFormDialog = false;
  }
}
