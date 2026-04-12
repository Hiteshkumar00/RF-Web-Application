import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BuyingBillListDto } from '../models/buying-bill-list.dto';
import { BuyingBillDto } from '../models/buying-bill.dto';
import { CreateBuyingBillDto } from '../models/create-buying-bill.dto';
import { UpdateBuyingBillDto } from '../models/update-buying-bill.dto';

@Injectable({
    providedIn: 'root'
})
export class BuyingBillApiService {
    private readonly basePath = `${environment.apiUrl}/BuyingBill`;
    private http = inject(HttpClient);

    getAll(): Observable<BuyingBillListDto[]> {
        return this.http.get<BuyingBillListDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<BuyingBillDto> {
        return this.http.get<BuyingBillDto>(`${this.basePath}/GetById?id=${id}`);
    }

    create(dto: CreateBuyingBillDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateBuyingBillDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete?id=${id}`);
    }

    getAllByAgencyId(agencyId: number): Observable<BuyingBillListDto[]> {
        return this.http.get<BuyingBillListDto[]>(`${this.basePath}/GetAllByAgencyId/${agencyId}`);
    }
}
