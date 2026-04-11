import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AgencyDto } from '../models/agency.model';
import { AgencyAdvancedListDto } from '../models/agency-advanced.model';
import { ViewAgencyAllDetailDto } from '../models/agency-all-detail.model';
import { CreateAgencyDto } from '../models/agency-create.dto';
import { UpdateAgencyDto } from '../models/agency-update.dto';

@Injectable({
    providedIn: 'root'
})
export class AgencyApiService {
    private readonly basePath = `${environment.apiUrl}/Agency`;
    private http = inject(HttpClient);

    getAll(): Observable<AgencyDto[]> {
        return this.http.get<AgencyDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<AgencyDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<AgencyDto>(`${this.basePath}/GetById`, { params });
    }

    create(dto: CreateAgencyDto): Observable<void> {
        return this.http.post<void>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateAgencyDto): Observable<void> {
        return this.http.put<void>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<void>(`${this.basePath}/Delete`, { params });
    }

    getAllAdvanced(): Observable<AgencyAdvancedListDto[]> {
        return this.http.get<AgencyAdvancedListDto[]>(`${this.basePath}/GetAllAdvanced`);
    }

    viewAllDetail(agencyId: number): Observable<ViewAgencyAllDetailDto> {
        const params = new HttpParams().set('agencyId', agencyId.toString());
        return this.http.get<ViewAgencyAllDetailDto>(`${this.basePath}/ViewAllDetail`, { params });
    }
}
