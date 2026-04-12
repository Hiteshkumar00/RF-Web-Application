import { UpdateBuyingBillExpenceDto } from "./buying-bill-expence.dto";
import { UpdateBuyingBillItemDto } from "./buying-bill-item.dto";
import { UpdateBuyingBillPaymentDto } from "./buying-bill-payment.dto";

export interface UpdateBuyingBillDto {
    id: number;
    agencyId: number;
    billNo: string;
    date: string | Date;
    discount: number;
    items: UpdateBuyingBillItemDto[];
    payments: UpdateBuyingBillPaymentDto[];
    expences: UpdateBuyingBillExpenceDto[];
}
