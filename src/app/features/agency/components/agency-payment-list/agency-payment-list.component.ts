import { Component, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { AgencyPaymentApiService } from '../../services/agency-payment-api.service';
import { AgencyPaymentListDto } from '../../models/agency-payment.model';
import { GlobalConfigService } from '../../../../core/services/global-config.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { HelperService } from '../../../../core/services/helper.service';


import { AgencyDialogService } from '../../services/agency-dialog.service';


@Component({
    selector: 'app-agency-payment-list',
    standalone: false,
    templateUrl: './agency-payment-list.component.html'
})
export class AgencyPaymentListComponent implements OnInit {
    private apiService = inject(AgencyPaymentApiService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    public globalConfig = inject(GlobalConfigService);
    private excelService = inject(ExcelService);
    private helperService = inject(HelperService);
    private agencyDialogService = inject(AgencyDialogService);

    payments: AgencyPaymentListDto[] = [];
    selectedPayments: AgencyPaymentListDto[] = [];
    exportMenuItems: MenuItem[] = [];



    ngOnInit(): void {
        this.loadData();
        this.updateExportMenu();
    }

    public updateExportMenu(): void {
        this.exportMenuItems = [
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                badge: this.selectedPayments.length > 0 ? this.selectedPayments.length.toString() : undefined,
                badgeStyleClass: 'p-badge-success',
                command: () => this.exportToExcel(true),
                disabled: this.selectedPayments.length === 0
            },
            { label: 'Export All', icon: 'pi pi-copy', command: () => this.exportToExcel(false) }
        ];
    }

    loadData(): void {
        this.apiService.getAll().subscribe({
            next: (data) => {
                this.payments = data ?? [];
                this.updateExportMenu();
            }
        });
    }

    openCreateDialog(): void {
        this.agencyDialogService.openPaymentForm('create', undefined, undefined, () => this.onFormSaved('create'), () => this.onFormDialogClosed());
    }

    openEditDialog(item: AgencyPaymentListDto): void {
        this.agencyDialogService.openPaymentForm('update', item.id, undefined, () => this.onFormSaved('update'), () => this.onFormDialogClosed());
    }

    openViewDialog(item: AgencyPaymentListDto): void {
        this.agencyDialogService.openPaymentForm('view', item.id, undefined, () => this.onFormSaved('view'), () => this.onFormDialogClosed());
    }

    onFormSaved(mode: 'create' | 'update' | 'view'): void {
        this.loadData();
        if (mode !== 'view') {
            const msg = mode === 'create'
                ? 'Agency payment recorded successfully.'
                : 'Agency payment updated successfully.';
            this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        }
    }

    onFormDialogClosed(): void {
    }

    confirmDelete(item: AgencyPaymentListDto): void {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: 'Are you sure you want to delete this agency payment? This will also revert all associated payment transactions.',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.deleteItem(item.id)
        });
    }

    private deleteItem(id: number): void {
        this.apiService.delete(id).subscribe({
            next: () => {
                this.loadData();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Agency payment deleted successfully.'
                });
            }
        });
    }

    exportToExcel(onlySelected: boolean = false): void {
        const source = onlySelected ? this.selectedPayments : this.payments;

        const data = source.map(item => ({
            'Payment ID': item.id,
            'Agency ID': item.agencyId,
            'Agency Name': item.agencyName,
            'Date': this.helperService.formatDate(item.date),
            'Description': item.description || '-',
            'Total Amount Paid': item.totalAmount
        }));
        this.excelService.exportAsExcelFile(data, onlySelected ? 'Agency_Payments_Selected' : 'Agency_Payments');
    }
}
