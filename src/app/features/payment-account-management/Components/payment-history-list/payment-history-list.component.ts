import { Component, OnInit } from '@angular/core';
import { PaymentAccountApiService } from '../../Services/payment-account-api.service';
import { PaymentHistoryDto, PaymentHistoryFilterDto } from '../../models/payment-history.dto';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { DropdownService } from '../../../../shared/services/dropdown.service';
import { HelperService } from '../../../../core/services/helper.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-payment-history-list',
    standalone: false,
    templateUrl: './payment-history-list.component.html'
})
export class PaymentHistoryListComponent implements OnInit {
    constructor(
        private apiService: PaymentAccountApiService,
        private dropdownService: DropdownService,
        private helperService: HelperService,
        public globalConfig: GlobalConfigService,
        private excelService: ExcelService
    ) {}

    history: PaymentHistoryDto[] = [];
    selectedHistory: PaymentHistoryDto[] = [];
    loading = false;
    exportMenuItems: MenuItem[] = [];

    filter: PaymentHistoryFilterDto = {
        paymentAccountId: null,
        direction: null,
        paymentType: null,
        fromDate: null,
        toDate: null
    };

    paymentAccountOptions: DropdownOption[] = [];
    directionOptions: DropdownOption[] = [
        { label: 'All Direction', value: null },
        { label: 'Received', value: 'Received' },
        { label: 'Paid', value: 'Paid' }
    ];
    typeOptions: DropdownOption[] = [
        { label: 'All Type', value: null },
        { label: 'Selling Bill', value: 'Selling Bill' },
        { label: 'Buying Bill', value: 'Buying Bill' },
        { label: 'Expense', value: 'Expense' },
        { label: 'Buying Bill Expense', value: 'Buying Bill Expense' },
        { label: 'Add Contribution', value: 'Add Contribution' },
        { label: 'Remove Contribution', value: 'Remove Contribution' },
        { label: 'Transfer', value: 'Transfer' }
    ];

    yearOptions: DropdownOption[] = [];
    monthOptions: DropdownOption[] = [
        { label: 'All Month', value: null },
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
    ];

    selectedYear: number | null = null;
    selectedMonth: number | null = null;

    ngOnInit(): void {
        this.initYearOptions();
        this.loadOptions();
        this.loadHistory();
        this.updateExportMenu();
    }

    public updateExportMenu(): void {
        this.exportMenuItems = [
            { 
                label: 'Export Selected', 
                icon: 'pi pi-check-square', 
                badge: this.selectedHistory.length > 0 ? this.selectedHistory.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedHistory.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    private initYearOptions(): void {
        const currentYear = new Date().getFullYear();
        this.yearOptions = [{ label: 'All Year', value: null }];
        for (let y = currentYear; y >= currentYear - 10; y--) {
            this.yearOptions.push({ label: y.toString(), value: y });
        }
    }

    loadOptions(): void {
        this.dropdownService.getPaymentAccountOptions().subscribe({
            next: (options) => {
                this.paymentAccountOptions = [{ label: 'All Accounts', value: null }, ...options];
            }
        });
    }

    loadHistory(): void {
        this.loading = true;
        
        let fromDate: Date | string | null | undefined = this.filter.fromDate;
        let toDate: Date | string | null | undefined = this.filter.toDate;

        if (this.selectedYear) {
            const year = this.selectedYear;
            if (this.selectedMonth) {
                const month = this.selectedMonth;
                fromDate = new Date(year, month - 1, 1);
                toDate = new Date(year, month, 0);
            } else {
                fromDate = new Date(year, 0, 1);
                toDate = new Date(year, 11, 31);
            }
        }

        const payload = {
            ...this.filter,
            fromDate: this.helperService.setDate(fromDate),
            toDate: this.helperService.setDate(toDate)
        };
        this.apiService.getHistory(payload).subscribe({
            next: (data) => {
                this.history = data;
                this.loading = false;
                this.updateExportMenu();
            },
            error: () => this.loading = false
        });
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedHistory : this.history;

        const data = source.map(item => ({
            'Payment Date': this.helperService.formatDate(item.date),
            'Payment Account': item.paymentAccountName,
            'Account Person': item.accountPersonName || '-',
            'Payment Description': item.description,
            'Received or Paid': item.direction,
            'Amount': item.amount,
            'Payment Type': item.paymentType,
            'Bill No': item.billNo || '-'
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Payment_History_Selected' : 'Payment_History');
    }

    onFilterChange(): void {
        this.loadHistory();
    }

    clearFilters(): void {
        this.filter = {
            paymentAccountId: null,
            direction: null,
            paymentType: null,
            fromDate: null,
            toDate: null
        };
        this.selectedYear = null;
        this.selectedMonth = null;
        this.loadHistory();
    }
}
