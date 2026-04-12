export interface BuyingBillPaymentDto {
    id: number;
    amount: number;
    paymentAccountId: number;
}

export interface CreateBuyingBillPaymentDto {
    amount: number;
    paymentAccountId: number;
}

export interface UpdateBuyingBillPaymentDto extends CreateBuyingBillPaymentDto {
    id?: number;
}
