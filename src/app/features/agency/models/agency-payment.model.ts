export interface AgencyPaymentListDto {
    id: number;
    agencyId: number;
    agencyName: string;
    date: string | Date;
    description?: string;
    totalAmount: number;
}

export interface AgencyPaymentTransactionDto {
    id: number;
    amount: number;
    paymentAccountId: number;
    paymentAccountName: string;
    date?: string | Date;
}

export interface AgencyPaymentDto {
    id: number;
    agencyId: number;
    agencyName: string;
    date: string | Date;
    description?: string;
    totalAmount: number;
    transactions: AgencyPaymentTransactionDto[];
}

export interface CreateAgencyPaymentTransactionDto {
    amount: number;
    paymentAccountId: number;
    date?: string | Date;
}

export interface CreateAgencyPaymentDto {
    agencyId: number;
    date: string | Date;
    description?: string;
    transactions: CreateAgencyPaymentTransactionDto[];
}

export interface UpdateAgencyPaymentTransactionDto {
    id?: number;
    amount: number;
    paymentAccountId: number;
    date?: string | Date;
}

export interface UpdateAgencyPaymentDto {
    id: number;
    agencyId: number;
    date: string | Date;
    description?: string;
    transactions: UpdateAgencyPaymentTransactionDto[];
}
