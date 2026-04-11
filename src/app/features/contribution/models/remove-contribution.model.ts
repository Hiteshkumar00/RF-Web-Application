export interface RemoveContributionPaymentDto {
    id?: number;
    amount: number;
    paymentAccountId: number;
    paymentAccountName?: string;
}

export interface RemoveContributionDto {
    id: number;
    accountPersonId: number;
    accountPersonName?: string;
    description?: string;
    date: string;
    payments: RemoveContributionPaymentDto[];
}

export interface RemoveContributionListDto {
    id: number;
    accountPersonName: string;
    date: string;
    totalAmount: number;
}

export interface CreateRemoveContributionDto {
    accountPersonId: number;
    description?: string;
    date: string;
    payments: RemoveContributionPaymentDto[];
}

export interface UpdateRemoveContributionDto {
    id: number;
    accountPersonId: number;
    description?: string;
    date: string;
    payments: RemoveContributionPaymentDto[];
}
