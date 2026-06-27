import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SellingBillListDto, SellingBillDetailsDto } from '../models/selling-bill.model';
import { CreateSellingBillDto } from '../models/create-selling-bill.dto';
import { UpdateSellingBillDto } from '../models/update-selling-bill.dto';
import { SellingBillPaymentDto } from '../models/selling-bill-payment.dto';

@Injectable({
    providedIn: 'root'
})
export class SellingBillApiService {
    private readonly basePath = `${environment.apiUrl}/SellingBill`;
    private http = inject(HttpClient);

    getAll(): Observable<SellingBillListDto[]> {
        return this.http.get<SellingBillListDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<SellingBillDetailsDto> {
        return this.http.get<SellingBillDetailsDto>(`${this.basePath}/GetById/${id}`);
    }

    getByCustomerId(customerId: number): Observable<SellingBillListDto[]> {
        return this.http.get<SellingBillListDto[]>(`${this.basePath}/GetByCustomerId/${customerId}`);
    }

    create(dto: CreateSellingBillDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateSellingBillDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete/${id}`);
    }



    downloadInvoice(id: number): Observable<Blob> {
        return this.http.get(`${this.basePath}/DownloadInvoice/${id}`, { responseType: 'blob' });
    }

    sendWhatsAppMessage(id: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/SendWhatsAppMessage/${id}`, {});
    }

    sendEmailMessage(id: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/SendEmailMessage/${id}`, {});
    }

    bulkSendWhatsAppMessages(ids: number[]): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/BulkSendWhatsAppMessages`, ids);
    }

    bulkSendEmailMessages(ids: number[]): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/BulkSendEmailMessages`, ids);
    }

    updatePayments(billId: number, payments: SellingBillPaymentDto[]): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/UpdatePayments/${billId}`, payments);
    }
}
