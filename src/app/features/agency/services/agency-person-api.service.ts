import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AgencyPersonDto } from '../models/agency-person.model';
import { CreateAgencyPersonDto } from '../models/agency-person-create.dto';
import { UpdateAgencyPersonDto } from '../models/agency-person-update.dto';

@Injectable({
    providedIn: 'root'
})
export class AgencyPersonApiService {
    private readonly basePath = `${environment.apiUrl}/AgencyPerson`;
    private http = inject(HttpClient);

    getAll(): Observable<AgencyPersonDto[]> {
        return this.http.get<AgencyPersonDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<AgencyPersonDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<AgencyPersonDto>(`${this.basePath}/GetById`, { params });
    }

    create(dto: CreateAgencyPersonDto): Observable<void> {
        return this.http.post<void>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateAgencyPersonDto): Observable<void> {
        return this.http.put<void>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<void>(`${this.basePath}/Delete`, { params });
    }
}
