import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AccountPersonDto } from '../models/account-person.model';
import { CreateAccountPersonDto } from '../models/account-person-create.dto';
import { UpdateAccountPersonDto } from '../models/account-person-update.dto';

@Injectable({
    providedIn: 'root'
})
export class AccountPersonApiService {
    private readonly basePath = `${environment.apiUrl}/AccountPerson`;
    private http = inject(HttpClient);

    getAll(): Observable<AccountPersonDto[]> {
        return this.http.get<AccountPersonDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<AccountPersonDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<AccountPersonDto>(`${this.basePath}/GetById`, { params });
    }

    create(dto: CreateAccountPersonDto): Observable<void> {
        return this.http.post<void>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateAccountPersonDto): Observable<void> {
        return this.http.put<void>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<void>(`${this.basePath}/Delete`, { params });
    }
}
