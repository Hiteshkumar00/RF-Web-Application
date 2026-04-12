export interface BuyingBillListDto {
    id: number;
    agencyId: number;
    agencyName: string;
    billNo: string;
    date: string;
    totalAmount: number;
    discount: number;
    netAmount: number;
    totalExpence: number;
    finalAmount: number;
    paidAmount: number;
    remainingAmount: number;
}
