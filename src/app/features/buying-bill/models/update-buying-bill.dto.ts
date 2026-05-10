import { UpdateBuyingBillExpenceDto } from "./buying-bill-expence.dto";
import { UpdateStockDto } from "./buying-bill-item.dto";
import { UpdateBuyingBillPaymentDto } from "./buying-bill-payment.dto";

export interface UpdateBuyingBillDto {
    id: number;
    agencyId: number;
    billNo: string;
    date: string | Date;
    stocks: UpdateStockDto[];
    payments: UpdateBuyingBillPaymentDto[];
    expences: UpdateBuyingBillExpenceDto[];
}
