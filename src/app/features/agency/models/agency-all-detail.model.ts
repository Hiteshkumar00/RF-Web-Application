import { AgencyDto } from './agency.model';

export interface AgencyPersonDto {
    id: number;
    agencyId: number;
    name: string;
    phoneNo: string | null;
    email: string | null;
    personOccupation: string | null;
    address: string | null;
}

export interface BuyingBillListDto {
    id: number;
    agencyId: number;
    agencyName: string;
    billNo: string;
    date: string;
    totalAmount: number;
    discount: number;
    netAmount: number;
    totalExpence: number;
    paidAmount: number;
    remainingAmount: number;
}

export interface AgencyBillsByYearDto {
    businessYearId: number | null;
    yearName: string;
    startDate: string | null;
    endDate: string | null;
    bills: BuyingBillListDto[];
}

export interface ViewAgencyAllDetailDto extends AgencyDto {
    totalBillsAmount: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
    agencyPersons: AgencyPersonDto[];
    billsByYear: AgencyBillsByYearDto[];
}
