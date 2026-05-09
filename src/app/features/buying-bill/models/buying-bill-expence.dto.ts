export interface BuyingBillExpenceDto {
    id: number;
    expenceType: string;
    totalAmount: number;
    amount: number;
    paymentAccountId: number;
}

export interface CreateBuyingBillExpenceDto {
    expenceType: string;
    totalAmount: number;
    amount: number;
    paymentAccountId: number;
}

export interface UpdateBuyingBillExpenceDto extends CreateBuyingBillExpenceDto {
    id?: number;
}
