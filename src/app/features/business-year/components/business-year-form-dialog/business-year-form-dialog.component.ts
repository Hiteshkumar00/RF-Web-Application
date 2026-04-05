import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { BusinessYearConstants } from '../../constants/business-year.constant';
import { BusinessYearApiService } from '../../services/business-year-api.service';
import { BusinessYearFormService } from '../../services/business-year-form.service';
import { BusinessYearListDto } from '../../models/business-year-list-dto.model';
import { HelperService } from '../../../../core/services/helper.service';

@Component({
  selector: 'app-business-year-form-dialog',
  standalone: false,
  templateUrl: './business-year-form-dialog.component.html',
  styleUrls: ['./business-year-form-dialog.component.css']
})
export class BusinessYearFormDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() businessYear: BusinessYearListDto | null = null;
  
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;
  labels = BusinessYearConstants;
  
  constructor(
    private formService: BusinessYearFormService,
    private apiService: BusinessYearApiService,
    private confirmationService: ConfirmationService,
    private helperService: HelperService
  ) {
    this.form = this.formService.createBusinessYearForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.mode === 'edit' && this.businessYear) {
        this.form.patchValue({
          id: this.businessYear.id,
          yearName: this.businessYear.yearName,
          date: this.businessYear.startDate ? new Date(this.businessYear.startDate) : null
        });
      } else {
        this.formService.resetForm(this.form);
      }
    }
  }

  get dialogTitle(): string {
    return this.mode === 'create' ? this.labels.ADD_BUSINESS_YEAR : this.labels.EDIT_BUSINESS_YEAR;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    if (this.mode === 'create') {
      this.apiService.create({
        yearName: value.yearName,
        date: this.helperService.setDate(value.date) || ''
      }).subscribe({
        next: (res) => {
          if (res) {
            this.saved.emit();
            this.formService.resetForm(this.form);
          }
        }
      });
    } else {
      this.apiService.update({
        id: value.id,
        yearName: value.yearName,
        date: this.helperService.setDate(value.date) || ''
      }).subscribe({
        next: (res) => {
          if (res) {
            this.saved.emit();
            this.formService.resetForm(this.form);
          }
        }
      });
    }
  }

  requestClose(): void {
    if (this.form.dirty) {
      this.confirmationService.confirm({
        header: this.labels.CLOSE_CONFIRM_HEADER,
        message: this.labels.CLOSE_CONFIRM_MESSAGE,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.formService.resetForm(this.form);
          this.closed.emit();
        }
      });
    } else {
      this.formService.resetForm(this.form);
      this.closed.emit();
    }
  }
}
