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
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DropdownService } from '../../../../shared/services/dropdown.service';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
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
        private fb: FormBuilder,
        private dropdownService: DropdownService,
        public accountDetailsService: AccountDetailsService
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

    showAgencyPaymentDialog = false;
    agencyPaymentForm!: FormGroup;
    selectedAgencyForPayment: AgencyAdvancedListDto | null = null;
    accountOptions: DropdownOption[] = [];

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
        this.initAgencyPaymentForm();
        this.loadAccountOptions();
    }

    private initAgencyPaymentForm(): void {
        this.agencyPaymentForm = this.fb.group({
            payments: this.fb.array([])
        });
    }

    get agencyPayments(): FormArray {
        return this.agencyPaymentForm.get('payments') as FormArray;
    }

    get totalAgencyPaid(): number {
        return this.agencyPayments.controls.reduce((sum, control) => sum + (control.get('amount')?.value || 0), 0);
    }

    addAgencyPayment(): void {
        const paymentGroup = this.fb.group({
            amount: [null, [Validators.required, Validators.min(0.01)]],
            paymentAccountId: [null, Validators.required],
            date: [new Date(), Validators.required]
        });
        this.agencyPayments.push(paymentGroup);
    }

    removeAgencyPayment(index: number): void {
        this.agencyPayments.removeAt(index);
    }

    private loadAccountOptions(): void {
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => this.accountOptions = options
        });
    }

    openAgencyPaymentDialog(agency: AgencyAdvancedListDto): void {
        this.selectedAgencyForPayment = agency;
        this.agencyPayments.clear();
        this.addAgencyPayment();
        this.showAgencyPaymentDialog = true;
    }

    submitAgencyPayment(): void {
        if (this.agencyPaymentForm.invalid || !this.selectedAgencyForPayment) {
            this.agencyPaymentForm.markAllAsTouched();
            return;
        }

        if (this.totalAgencyPaid > this.selectedAgencyForPayment.totalPendingAmount) {
            return; // Handled in template
        }

        const formValue = this.agencyPaymentForm.value;
        const payments = formValue.payments.map((p: any) => ({
            ...p,
            date: this.helperService.setDate(p.date)
        }));

        const dto = {
            agencyId: this.selectedAgencyForPayment.id,
            payments: payments
        };

        this.agencyApiService.payOldestBills(dto).subscribe({
            next: () => {
                this.showAgencyPaymentDialog = false;
                this.loadAgencies();
            }
        });
    }

    onAgencyPaymentDialogClosed(): void {
        this.showAgencyPaymentDialog = false;
        this.selectedAgencyForPayment = null;
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
