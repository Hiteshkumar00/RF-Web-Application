export interface PaymentAccountBalanceDto {
    paymentAccountId: number;
    paymentAccountName: string;
    balance: number;
}

export interface PaymentAccountDashboardDto {
    totalAvailableBalance: number;
    paymentAccountBalances: PaymentAccountBalanceDto[];
}
