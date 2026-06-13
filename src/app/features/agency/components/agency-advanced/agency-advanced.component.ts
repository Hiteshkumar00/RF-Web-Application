import { Component, OnInit } from '@angular/core';
import { AgencyApiService } from '../../services/agency-api.service';
import { AgencyAdvancedListDto } from '../../models/agency-advanced.model';
import { ViewAgencyAllDetailDto } from '../../models/agency-all-detail.model';
import { AgencyLabels } from '../../constants/agency-labels.constants';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';
import { MenuItem, MessageService } from 'primeng/api';
import { AgencyTableColumns } from '../../constants/agency-table.constants';
import { AccountDetailsService } from '../../../../core/services/account-details.service';
import { StatisticCard } from '../../../../shared/models/statistic-card.model';

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
        private helperService: HelperService,
        public accountDetailsService: AccountDetailsService,
        private messageService: MessageService
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
    selectedAgencyId?: number;


    // Summary totals
    get totalAllBills(): number {
        return this.agencies.reduce((sum, a) => sum + (a.totalBillsAmount || 0), 0);
    }

    get totalAllPaid(): number {
        return this.agencies.reduce((sum, a) => sum + (a.totalPaidAmount || 0), 0);
    }

    get totalAllPending(): number {
        return this.agencies.reduce((sum, a) => sum + (a.totalPendingAmount || 0), 0);
    }

    get statisticCards(): StatisticCard[] {
        return [
            { title: 'Total Bills Amount', amount: this.totalAllBills, colorClass: 'info', icon: 'pi-file' },
            { title: 'Total Paid', amount: this.totalAllPaid, colorClass: 'success', icon: 'pi-check-circle' },
            { title: 'Total Pending', amount: this.totalAllPending, colorClass: '', icon: 'pi-clock', isRemaining: true }
        ];
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

    openMakePaymentDialog(agency: AgencyAdvancedListDto): void {
        this.selectedAgencyId = agency.id;
        this.showPaymentDialog = true;
    }

    onPaymentSaved(): void {
        this.showPaymentDialog = false;
        this.loadAgencies();
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Agency payment recorded successfully.'
        });
    }

    onPaymentDialogClosed(): void {
        this.showPaymentDialog = false;
    }
}
