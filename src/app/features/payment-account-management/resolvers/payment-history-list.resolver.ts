import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentAccountApiService } from '../Services/payment-account-api.service';
import { PaymentHistoryDto } from '../models/payment-history.dto';

@Injectable({ providedIn: 'root' })
export class PaymentHistoryListResolver implements Resolve<PaymentHistoryDto[]> {
  private apiService = inject(PaymentAccountApiService);

  resolve(): Observable<PaymentHistoryDto[]> {
    return this.apiService.getHistory({
      paymentAccountId: null,
      direction: null,
      paymentType: null,
      fromDate: null,
      toDate: null
    });
  }
}
