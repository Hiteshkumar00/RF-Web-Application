export interface BuyingBillPaymentDto {
    id: number;
    amount: number;
    paymentAccountId: number;
    date?: string | null;
}

export interface CreateBuyingBillPaymentDto {
    amount: number;
    paymentAccountId: number;
    date?: string | null;
}

export interface UpdateBuyingBillPaymentDto extends CreateBuyingBillPaymentDto {
    id?: number;
}
