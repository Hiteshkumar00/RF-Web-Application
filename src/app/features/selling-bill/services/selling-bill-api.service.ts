import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SellingBillListDto, SellingBillDetailsDto, SellingBillItemSuggestionDto } from '../models/selling-bill.model';
import { CreateSellingBillDto } from '../models/create-selling-bill.dto';
import { UpdateSellingBillDto } from '../models/update-selling-bill.dto';

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

    create(dto: CreateSellingBillDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateSellingBillDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete/${id}`);
    }

    getItemSuggestions(): Observable<SellingBillItemSuggestionDto[]> {
        return this.http.get<SellingBillItemSuggestionDto[]>(`${this.basePath}/GetItemSuggestions`);
    }

    downloadInvoice(id: number): Observable<Blob> {
        return this.http.get(`${this.basePath}/DownloadInvoice/${id}`, { responseType: 'blob' });
    }

    sendWhatsAppMessage(id: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/SendWhatsAppMessage/${id}`, {});
    }
}
