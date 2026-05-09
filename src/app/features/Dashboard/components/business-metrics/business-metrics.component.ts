import { Component, inject, OnInit } from '@angular/core';
import { DashboardApiService } from '../../services/dashboard-api.service';
import { DashboardDto } from '../../models/dashboard.dto';
import { DashboardLabels } from '../../constants/dashboard-labels.constants';

@Component({
    selector: 'app-business-metrics',
    standalone: false,
    templateUrl: './business-metrics.component.html',
    styles: [``]
})
export class BusinessMetricsComponent implements OnInit {
    private dashboardApi = inject(DashboardApiService);
    labels = DashboardLabels;
    metrics?: DashboardDto;
    loading = true;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.dashboardApi.getMetrics().subscribe({
            next: (data) => {
                this.metrics = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
