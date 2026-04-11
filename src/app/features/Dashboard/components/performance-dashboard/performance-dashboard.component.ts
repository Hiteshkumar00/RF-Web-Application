import { Component, inject, OnInit } from '@angular/core';
import { DashboardApiService } from '../../services/dashboard-api.service';
import { AllTimeDashboardItemDto } from '../../models/all-time-dashboard-item.dto';
import { DashboardLabels } from '../../constants/dashboard-labels.constants';

@Component({
    selector: 'app-performance-dashboard',
    standalone: false,
    templateUrl: './performance-dashboard.component.html'
})
export class PerformanceDashboardComponent implements OnInit {
    private dashboardApi = inject(DashboardApiService);
    labels = DashboardLabels;
    metrics: AllTimeDashboardItemDto[] = [];
    loading = true;

    // Chart Data
    chartData: any;
    chartOptions: any;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.dashboardApi.getAllTimeMetrics().subscribe({
            next: (data) => {
                this.metrics = data ?? [];
                this.initChart();
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    private initChart(): void {
        if (!this.metrics.length) return;

        this.chartData = {
            labels: this.metrics.map(m => m.businessYearName),
            datasets: [
                {
                    label: this.labels.TOTAL_PROFIT,
                    data: this.metrics.map(m => m.totalProfit),
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: .4
                },
                {
                    label: this.labels.TOTAL_SELLING,
                    data: this.metrics.map(m => m.totalSellingAmount),
                    fill: false,
                    borderColor: '#66BB6A',
                    tension: .4
                },
                {
                    label: this.labels.TOTAL_EXPENSE,
                    data: this.metrics.map(m => m.totalExpenceAmount),
                    fill: false,
                    borderColor: '#f44336',
                    tension: .4
                },
                {
                    label: this.labels.SELLING_PENDING,
                    data: this.metrics.map(m => m.sellingPendingAmount),
                    fill: false,
                    borderColor: '#FF9800',
                    tension: .4
                },
                {
                    label: this.labels.BUYING_PENDING,
                    data: this.metrics.map(m => m.buyingPendingAmount),
                    fill: false,
                    borderColor: '#9C27B0',
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: { labels: { color: '#495057' } }
            },
            scales: {
                x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
                y: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } }
            }
        };
    }
}
