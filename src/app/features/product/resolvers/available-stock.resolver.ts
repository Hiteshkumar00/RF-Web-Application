import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardApiService } from '../../dashboard/services/dashboard-api.service';

@Injectable({ providedIn: 'root' })
export class AvailableStockResolver implements Resolve<any> {
  private apiService = inject(DashboardApiService);

  resolve(): Observable<any> {
    return this.apiService.getProductProfitMetrics();
  }
}
