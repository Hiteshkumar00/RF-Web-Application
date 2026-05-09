export interface ExpensePaymentDto {
    id?: number;
    amount: number;
    paymentAccountId: number;
    paymentAccountName?: string;
}

export interface ExpenseDto {
    id: number;
    accountId: number;
    expenceType: string;
    date: string;
    totalAmount: number;
    buyingBillId?: number;
    buyingBillNo?: string;
    agencyName?: string;
    payments: ExpensePaymentDto[];
}

export interface ExpenseListDto {
    id: number;
    expenceType: string;
    date: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    buyingBillId?: number;
    buyingBillNo?: string;
    agencyName?: string;
}
