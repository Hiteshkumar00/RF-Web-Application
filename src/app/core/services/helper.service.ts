import { Injectable, inject } from '@angular/core';
import { AccountDetailsService } from './account-details.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private accountDetailsService = inject(AccountDetailsService);
  private datePipe = new DatePipe('en-US');

  /**
   * Converts a Date object or string to a "DateOnly" string (YYYY-MM-DD).
   * Ensuring the date is not shifted by timezone offsets.
   */
  setDate(date: Date | string | null | undefined): string | null {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Formats a date string or object based on the account's configured date format.
   */
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const format = this.accountDetailsService.dateFormat;
    return this.datePipe.transform(date, format) || '-';
  }
}
