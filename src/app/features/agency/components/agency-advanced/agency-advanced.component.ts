import { Component, inject, OnInit } from '@angular/core';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyAdvancedListDto } from '../../models/agency-advanced.model';
import { ViewAgencyAllDetailDto } from '../../models/agency-all-detail.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { AgencyTableColumns } from '../../constants/agency-table.constants';

@Component({
    selector: 'app-agency-advanced',
    standalone: false,
    templateUrl: './agency-advanced.component.html'
})
export class AgencyAdvancedComponent implements OnInit {
    private agencyApiService = inject(AgencyApiService);

    labels = AgencyLabels;
    columns = AgencyTableColumns.ADVANCED_COLUMNS;
    agencies: AgencyAdvancedListDto[] = [];

    showDetailDialog = false;
    selectedDetail: ViewAgencyAllDetailDto | null = null;

    ngOnInit(): void {
        this.loadAgencies();
    }

    loadAgencies(): void {
        this.agencyApiService.getAllAdvanced().subscribe({
            next: (data) => this.agencies = data ?? []
        });
    }

    openDetailDialog(agency: AgencyAdvancedListDto): void {
        this.showDetailDialog = true;
        this.selectedDetail = null;
        this.agencyApiService.viewAllDetail(agency.id).subscribe({
            next: (detail) => {
                this.selectedDetail = detail;
            },
            error: () => {
                
            }
        });
    }

    closeDetailDialog(): void {
        this.showDetailDialog = false;
        this.selectedDetail = null;
    }
}
