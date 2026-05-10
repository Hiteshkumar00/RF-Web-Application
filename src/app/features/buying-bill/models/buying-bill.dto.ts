import { UpdateBuyingBillDto } from "./update-buying-bill.dto";

export interface BuyingBillDto extends UpdateBuyingBillDto {
    accountId: number;
    totalAmount: number;
    netAmount: number;
    totalExpence: number;
    agencyName: string;
}
