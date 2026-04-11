import { CreateExpensePaymentDto } from './expense-create.dto';

export interface UpdateExpensePaymentDto extends CreateExpensePaymentDto {
    id?: number;
}

export interface UpdateExpenseDto {
    id: number;
    expenceType: string;
    date: string;
    payments: UpdateExpensePaymentDto[];
}
