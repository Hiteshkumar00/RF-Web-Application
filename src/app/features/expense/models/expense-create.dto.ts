export interface CreateExpensePaymentDto {
    amount: number;
    paymentAccountId: number;
}

export interface CreateExpenseDto {
    expenceType: string;
    date: string;
    totalAmount: number;
    payments: CreateExpensePaymentDto[];
}
