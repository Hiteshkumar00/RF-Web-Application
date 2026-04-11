import { SellingBillWarrentyDto } from "./selling-bill-warrenty.dto";

export interface SellingBillItemDto {
    id?: number;
    itemName: string;
    quantity: number;
    price: number;
    warrenty?: SellingBillWarrentyDto;
}
