export interface PaymentAccountDto {
    id: number;
    methodName: string;
    accountPersonId: number | null;
    accountPersonName?: string; // Optional for list view
}
