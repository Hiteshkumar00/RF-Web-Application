import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentAccountApiService } from '../Services/payment-account-api.service';
import { PaymentAccountDto } from '../models/payment-account.model';

@Injectable({ providedIn: 'root' })
export class PaymentAccountListResolver implements Resolve<PaymentAccountDto[]> {
  private apiService = inject(PaymentAccountApiService);

  resolve(): Observable<PaymentAccountDto[]> {
    return this.apiService.getAll();
  }
}
