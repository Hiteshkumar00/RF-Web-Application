export interface BuyingBillItemDto {
    id: number;
    itemName: string;
    quantity: number;
    price: number;
}

export interface CreateBuyingBillItemDto {
    itemName: string;
    quantity: number;
    price: number;
}

export interface UpdateBuyingBillItemDto extends CreateBuyingBillItemDto {
    id?: number;
}
