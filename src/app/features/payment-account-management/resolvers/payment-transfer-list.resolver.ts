import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentAccountApiService } from '../Services/payment-account-api.service';
import { PaymentTransfer } from '../models/payment-transfer.model';

@Injectable({ providedIn: 'root' })
export class PaymentTransferListResolver implements Resolve<PaymentTransfer[]> {
  private apiService = inject(PaymentAccountApiService);

  resolve(): Observable<PaymentTransfer[]> {
    return this.apiService.getTransfers({});
  }
}
