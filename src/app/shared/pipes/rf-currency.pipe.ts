import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AccountDetailsService } from '../../core/services/account-details.service';

@Pipe({
  name: 'rfCurrency',
  standalone: true
})
export class RfCurrencyPipe implements PipeTransform {
  private accountDetailsService = inject(AccountDetailsService);
  private currencyPipe = new CurrencyPipe('en-IN');

  transform(value: any, currencyCode?: string, display?: 'code' | 'symbol' | 'narrowSymbol' | string | boolean, digitsInfo?: string, locale?: string): string | null {
    if (value === null || value === undefined || value === '') return null;
    
    // Use provided currency or fallback to account settings
    const finalCurrencyCode = currencyCode || this.accountDetailsService.getCurrency() || 'INR';
    
    return this.currencyPipe.transform(value, finalCurrencyCode, display || 'symbol', digitsInfo, locale);
  }
}
