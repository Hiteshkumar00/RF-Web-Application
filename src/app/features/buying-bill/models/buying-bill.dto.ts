import { UpdateBuyingBillDto } from "./update-buying-bill.dto";

export interface BuyingBillDto extends UpdateBuyingBillDto {
    accountId: number;
    totalAmount: number;
    finalAmount: number; // sum of net amount + expenses
}
