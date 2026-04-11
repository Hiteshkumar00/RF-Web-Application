import { SellingBillItemDto } from "./selling-bill-item.dto";
import { SellingBillPaymentDto } from "./selling-bill-payment.dto";

export interface CreateSellingBillDto {
    billNo: string;
    customerName: string;
    email?: string;
    phoneNo: string;
    address?: string;
    date: string;
    discount: number;
    items: SellingBillItemDto[];
    payments: SellingBillPaymentDto[];
}
