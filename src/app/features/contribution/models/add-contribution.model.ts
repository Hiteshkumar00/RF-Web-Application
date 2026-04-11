export interface AddContributionPaymentDto {
    id?: number;
    amount: number;
    paymentAccountId: number;
    paymentAccountName?: string;
}

export interface AddContributionDto {
    id: number;
    accountPersonId: number;
    accountPersonName?: string;
    description?: string;
    date: string;
    payments: AddContributionPaymentDto[];
}

export interface AddContributionListDto {
    id: number;
    accountPersonName: string;
    date: string;
    totalAmount: number;
}

export interface CreateAddContributionDto {
    accountPersonId: number;
    description?: string;
    date: string;
    payments: AddContributionPaymentDto[];
}

export interface UpdateAddContributionDto {
    id: number;
    accountPersonId: number;
    description?: string;
    date: string;
    payments: AddContributionPaymentDto[];
}
