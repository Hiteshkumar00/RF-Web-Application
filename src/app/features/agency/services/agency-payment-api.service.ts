import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    AgencyPaymentListDto,
    AgencyPaymentDto,
    CreateAgencyPaymentDto,
    UpdateAgencyPaymentDto
} from '../models/agency-payment.model';

@Injectable({
    providedIn: 'root'
})
export class AgencyPaymentApiService {
    private readonly basePath = `${environment.apiUrl}/AgencyPayment`;
    private http = inject(HttpClient);

    getAll(): Observable<AgencyPaymentListDto[]> {
        return this.http.get<AgencyPaymentListDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<AgencyPaymentDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<AgencyPaymentDto>(`${this.basePath}/GetById`, { params });
    }

    create(dto: CreateAgencyPaymentDto): Observable<any> {
        return this.http.post<any>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateAgencyPaymentDto): Observable<any> {
        return this.http.put<any>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<any>(`${this.basePath}/Delete`, { params });
    }
}
