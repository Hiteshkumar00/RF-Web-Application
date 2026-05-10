import { Component, OnInit } from '@angular/core';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyAdvancedListDto } from '../../models/agency-advanced.model';
import { ViewAgencyAllDetailDto } from '../../models/agency-all-detail.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';
import { MenuItem } from 'primeng/api';
import { AgencyTableColumns } from '../../constants/agency-table.constants';

@Component({
    selector: 'app-agency-advanced',
    standalone: false,
    templateUrl: './agency-advanced.component.html'
})
export class AgencyAdvancedComponent implements OnInit {
    constructor(
        private agencyApiService: AgencyApiService,
        public globalConfig: GlobalConfigService,
        private excelService: ExcelService,
        private helperService: HelperService
    ) {}

    labels = AgencyLabels;
    columns = AgencyTableColumns.ADVANCED_COLUMNS;
    agencies: AgencyAdvancedListDto[] = [];
    selectedAgencies: AgencyAdvancedListDto[] = [];
    exportMenuItems: MenuItem[] = [];

    showDetailDialog = false;
    selectedDetail: ViewAgencyAllDetailDto | null = null;
    expandedYearRows: any = {};

    showPaymentDialog = false;
    selectedBill: any = null;

    openPaymentDialog(bill: any): void {
        this.selectedBill = {
            id: bill.id,
            billNo: bill.billNo,
            agencyName: this.selectedDetail?.agencyName || ''
        };
        this.showPaymentDialog = true;
    }

    onPaymentSaved(): void {
        this.showPaymentDialog = false;
        if (this.selectedDetail) {
            // Refresh detail to show updated amounts
            this.openDetailDialog({ id: this.selectedDetail.id } as any);
        }
        this.loadAgencies(); // Refresh the main list too
    }

    onPaymentDialogClosed(): void {
        this.showPaymentDialog = false;
    }

    ngOnInit(): void {
        this.loadAgencies();
        this.updateExportMenu();
    }

    public updateExportMenu(): void {
        this.exportMenuItems = [
            { 
                label: 'Export Selected', 
                icon: 'pi pi-check-square', 
                badge: this.selectedAgencies.length > 0 ? this.selectedAgencies.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedAgencies.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    loadAgencies(): void {
        this.agencyApiService.getAllAdvanced().subscribe({
            next: (data: AgencyAdvancedListDto[]) => {
                this.agencies = data ?? [];
                this.updateExportMenu();
            }
        });
    }

    openDetailDialog(agency: AgencyAdvancedListDto): void {
        this.agencyApiService.viewAllDetail(agency.id).subscribe({
            next: (data: ViewAgencyAllDetailDto) => {
                this.selectedDetail = data;
                this.showDetailDialog = true;
            }
        });
    }

    closeDetailDialog(): void {
        this.showDetailDialog = false;
        this.selectedDetail = null;
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedAgencies : this.agencies;

        const data = source.map(item => ({
            'ID': item.id,
            [this.labels.AGENCY_NAME]: item.agencyName,
            [this.labels.ADDRESS]: item.address || '-',
            [this.labels.TOTAL_BILLS]: item.totalBillsAmount,
            [this.labels.TOTAL_PAID]: item.totalPaidAmount,
            [this.labels.TOTAL_REMAINING]: item.totalPendingAmount,
            'Exp. Total': item.totalExpenceAmount,
            'Exp. Paid': item.totalExpencePaidAmount,
            'Exp. Rem.': item.totalExpencePendingAmount
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Agencies_Advanced_Selected' : 'Agencies_Advanced');
    }
}
