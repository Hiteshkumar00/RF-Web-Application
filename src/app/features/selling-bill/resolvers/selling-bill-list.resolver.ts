import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellingBillApiService } from '../services/selling-bill-api.service';
import { SellingBillListDto } from '../models/selling-bill.model';

@Injectable({ providedIn: 'root' })
export class SellingBillListResolver implements Resolve<SellingBillListDto[]> {
  private apiService = inject(SellingBillApiService);

  resolve(): Observable<SellingBillListDto[]> {
    return this.apiService.getAll();
  }
}
