import { UpdateSellingBillDto } from "./update-selling-bill.dto";

export interface SellingBillListDto {
    id: number;
    billNo: string;
    customerName: string;
    phoneNo: string;
    date: string;
    totalAmount: number;
    discount: number;
    netAmount: number;
    paidAmount: number;
    remainingAmount: number;
}

export interface SellingBillDetailsDto extends UpdateSellingBillDto {
    totalAmount: number;
    finalAmount: number;
}
