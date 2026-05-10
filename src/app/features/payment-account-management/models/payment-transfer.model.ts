export interface PaymentTransfer {
    id: number;
    fromPaymentAccountId: number;
    fromPaymentAccountName?: string;
    toPaymentAccountId: number;
    toPaymentAccountName?: string;
    amount: number;
    description: string;
    date: Date | string;
}

export interface CreatePaymentTransfer {
    fromPaymentAccountId: number;
    toPaymentAccountId: number;
    amount: number;
    description: string;
    date: Date | string;
}

export interface UpdatePaymentTransfer extends CreatePaymentTransfer {
    id: number;
}

export interface PaymentTransferFilter {
    fromPaymentAccountId?: number;
    toPaymentAccountId?: number;
    fromDate?: Date | string;
    toDate?: Date | string;
}
