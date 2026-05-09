import { Component, inject, OnInit } from '@angular/core';
import { PaymentAccountApiService } from '../../Services/payment-account-api.service';
import { PaymentHistoryDto, PaymentHistoryFilterDto } from '../../models/payment-history.dto';
import { DropdownOption } from '../../../../shared/models/dropdown-option.model';
import { DropdownService } from '../../../../shared/services/dropdown.service';
import { HelperService } from '../../../../core/services/helper.service';
import { GlobalConfigService } from '../../../../core/services/global-config.service';

@Component({
    selector: 'app-payment-history-list',
    standalone: false,
    templateUrl: './payment-history-list.component.html'
})
export class PaymentHistoryListComponent implements OnInit {
    private apiService = inject(PaymentAccountApiService);
    private dropdownService = inject(DropdownService);
    private helperService = inject(HelperService);
    public globalConfig = inject(GlobalConfigService);

    history: PaymentHistoryDto[] = [];
    loading = false;

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
        { label: 'Remove Contribution', value: 'Remove Contribution' }
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
            },
            error: () => this.loading = false
        });
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
