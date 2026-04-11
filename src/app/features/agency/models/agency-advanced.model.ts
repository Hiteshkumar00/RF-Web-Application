import { AgencyDto } from './agency.model';

export interface AgencyAdvancedListDto extends AgencyDto {
    totalBillsAmount: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
}
