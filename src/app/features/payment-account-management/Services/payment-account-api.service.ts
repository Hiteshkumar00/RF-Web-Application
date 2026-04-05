import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaymentAccountDto } from '../models/payment-account.model';
import { CreatePaymentAccountDto } from '../models/create-payment-account.dto';
import { UpdatePaymentAccountDto } from '../models/update-payment-account.dto';

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
}
