export interface BuyingBillExpenceDto {
    id: number;
    expenceType: string;
    amount: number;
    paymentAccountId: number;
}

export interface CreateBuyingBillExpenceDto {
    expenceType: string;
    amount: number;
    paymentAccountId: number;
}

export interface UpdateBuyingBillExpenceDto extends CreateBuyingBillExpenceDto {
    id?: number;
}
