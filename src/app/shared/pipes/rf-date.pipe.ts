import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AccountDetailsService } from '../../core/services/account-details.service';

@Pipe({
  name: 'rfDate'
})
export class RfDatePipe implements PipeTransform {
  private accountDetailsService = inject(AccountDetailsService);
  private datePipe = new DatePipe('en-US');

  transform(value: any): any {
    if (!value) return null;
    const format = this.accountDetailsService.dateFormat;
    return this.datePipe.transform(value, format);
  }
}
