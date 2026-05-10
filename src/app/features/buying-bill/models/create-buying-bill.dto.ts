import { CreateBuyingBillExpenceDto } from "./buying-bill-expence.dto";
import { CreateStockDto } from "./buying-bill-item.dto"; // Reusing the same file renamed internally
import { CreateBuyingBillPaymentDto } from "./buying-bill-payment.dto";

export interface CreateBuyingBillDto {
    agencyId: number;
    billNo: string;
    date: string | Date;
    stocks: CreateStockDto[];
    payments: CreateBuyingBillPaymentDto[];
    expences: CreateBuyingBillExpenceDto[];
}
