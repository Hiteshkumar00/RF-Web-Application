import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { BuyingBillApiService } from '../services/buying-bill-api.service';
import { BuyingBillListDto } from '../models/buying-bill-list.dto';

@Injectable({ providedIn: 'root' })
export class BuyingBillListResolver implements Resolve<BuyingBillListDto[]> {
  private apiService = inject(BuyingBillApiService);

  resolve(): Observable<BuyingBillListDto[]> {
    return this.apiService.getAll();
  }
}
