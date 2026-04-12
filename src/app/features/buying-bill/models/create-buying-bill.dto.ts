import { CreateBuyingBillExpenceDto } from "./buying-bill-expence.dto";
import { CreateBuyingBillItemDto } from "./buying-bill-item.dto";
import { CreateBuyingBillPaymentDto } from "./buying-bill-payment.dto";

export interface CreateBuyingBillDto {
    agencyId: number;
    billNo: string;
    date: string | Date;
    discount: number;
    items: CreateBuyingBillItemDto[];
    payments: CreateBuyingBillPaymentDto[];
    expences: CreateBuyingBillExpenceDto[];
}
