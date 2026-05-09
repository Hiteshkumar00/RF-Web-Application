export interface PaymentHistoryDto {
    id: number;
    paymentAccountName: string;
    accountPersonName?: string;
    description: string;
    direction: string;
    amount: number;
    date: string;
    paymentType: string;
    billNo?: string;
}

export interface PaymentHistoryFilterDto {
    paymentAccountId?: number | null;
    direction?: string | null;
    paymentType?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
}
