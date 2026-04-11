import { Component, inject, OnInit } from '@angular/core';
import { DashboardApiService } from '../../services/dashboard-api.service';
import { PaymentAccountDashboardDto } from '../../models/payment-account-dashboard.dto';
import { DashboardLabels } from '../../constants/dashboard-labels.constants';

@Component({
    selector: 'app-payment-dashboard',
    standalone: false,
    templateUrl: './payment-dashboard.component.html'
})
export class PaymentDashboardComponent implements OnInit {
    private dashboardApi = inject(DashboardApiService);
    labels = DashboardLabels;
    metrics?: PaymentAccountDashboardDto;
    loading = true;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.dashboardApi.getPaymentAccountMetrics().subscribe({
            next: (data) => {
                this.metrics = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
