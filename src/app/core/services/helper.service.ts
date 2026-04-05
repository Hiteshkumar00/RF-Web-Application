import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor() {}

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
}
