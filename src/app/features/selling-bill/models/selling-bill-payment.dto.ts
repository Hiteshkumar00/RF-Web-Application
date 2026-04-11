export interface SellingBillPaymentDto {
    id?: number;
    amount: number;
    paymentAccountId: number;
    paymentAccountMethodName?: string;
}
