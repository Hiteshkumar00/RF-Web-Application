import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardDto } from '../models/dashboard.dto';
import { PaymentAccountDashboardDto } from '../models/payment-account-dashboard.dto';
import { AllTimeDashboardItemDto } from '../models/all-time-dashboard-item.dto';

@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {
    private readonly basePath = `${environment.apiUrl}/Dashboard`;
    private http = inject(HttpClient);

    getMetrics(): Observable<DashboardDto> {
        return this.http.get<DashboardDto>(`${this.basePath}/Get`);
    }

    getPaymentAccountMetrics(): Observable<PaymentAccountDashboardDto> {
        return this.http.get<PaymentAccountDashboardDto>(`${this.basePath}/GetPaymentAccountDashboard`);
    }

    getAllTimeMetrics(): Observable<AllTimeDashboardItemDto[]> {
        return this.http.get<AllTimeDashboardItemDto[]>(`${this.basePath}/GetAllTimeDashboard`);
    }
}
