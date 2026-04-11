import { Component, inject, OnInit } from '@angular/core';
import { DashboardApiService } from '../../services/dashboard-api.service';
import { DashboardDto } from '../../models/dashboard.dto';
import { DashboardLabels } from '../../constants/dashboard-labels.constants';

@Component({
    selector: 'app-business-metrics',
    standalone: false,
    templateUrl: './business-metrics.component.html',
    styles: [`
        .metric-card { transition: transform 0.2s; border-radius: 12px; overflow: hidden; }
        .metric-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    `]
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
