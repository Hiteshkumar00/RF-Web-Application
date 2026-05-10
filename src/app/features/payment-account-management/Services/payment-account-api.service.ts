import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaymentAccountDto } from '../models/payment-account.model';
import { CreatePaymentAccountDto } from '../models/create-payment-account.dto';
import { UpdatePaymentAccountDto } from '../models/update-payment-account.dto';
import { PaymentHistoryDto, PaymentHistoryFilterDto } from '../models/payment-history.dto';
import { CreatePaymentTransfer, PaymentTransfer, PaymentTransferFilter, UpdatePaymentTransfer } from '../models/payment-transfer.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentAccountApiService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/PaymentAccount`;

    getAll(): Observable<PaymentAccountDto[]> {
        return this.http.get<PaymentAccountDto[]>(`${this.apiUrl}/GetAll`);
    }

    getById(id: number): Observable<PaymentAccountDto> {
        return this.http.get<PaymentAccountDto>(`${this.apiUrl}/GetById`, { params: { id } });
    }

    create(dto: CreatePaymentAccountDto): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/Create`, dto);
    }

    update(dto: UpdatePaymentAccountDto): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/Update`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Delete`, { params: { id } });
    }

    getHistory(filter: PaymentHistoryFilterDto): Observable<PaymentHistoryDto[]> {
        return this.http.post<PaymentHistoryDto[]>(`${this.apiUrl}/GetHistory`, filter);
    }

    // Payment Transfer
    getTransfers(filter: PaymentTransferFilter): Observable<PaymentTransfer[]> {
        return this.http.post<PaymentTransfer[]>(`${this.apiUrl}/GetTransfers`, filter);
    }

    createTransfer(dto: CreatePaymentTransfer): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/CreateTransfer`, dto);
    }

    updateTransfer(dto: UpdatePaymentTransfer): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/UpdateTransfer`, dto);
    }

    deleteTransfer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/DeleteTransfer`, { params: { id } });
    }

    getTransferById(id: number): Observable<PaymentTransfer> {
        return this.http.get<PaymentTransfer>(`${this.apiUrl}/GetTransferById`, { params: { id } });
    }
}
