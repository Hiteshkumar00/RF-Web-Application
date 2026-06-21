import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AgencyPaymentApiService } from '../services/agency-payment-api.service';
import { AgencyPaymentListDto } from '../models/agency-payment.model';

@Injectable({ providedIn: 'root' })
export class AgencyPaymentListResolver implements Resolve<AgencyPaymentListDto[]> {
  private apiService = inject(AgencyPaymentApiService);

  resolve(): Observable<AgencyPaymentListDto[]> {
    return this.apiService.getAll();
  }
}
