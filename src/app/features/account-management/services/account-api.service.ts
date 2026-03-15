import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AccountDto } from '../models/account.model';
import { CreateAccountDto } from '../models/account-create.dto';
import { UpdateAccountDto } from '../models/account-update.dto';

@Injectable({
    providedIn: 'root'
})
export class AccountApiService {
    private readonly basePath = `${environment.apiUrl}/Account`;
    private http = inject(HttpClient);

    getAll(): Observable<AccountDto[]> {
        return this.http.get<AccountDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<AccountDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<AccountDto>(`${this.basePath}/GetAccountById`, { params });
    }

    create(dto: CreateAccountDto): Observable<AccountDto> {
        return this.http.post<AccountDto>(`${this.basePath}/CreateAccount`, dto);
    }

    update(dto: UpdateAccountDto): Observable<AccountDto> {
        return this.http.put<AccountDto>(`${this.basePath}/UpdateAccount`, dto);
    }

    delete(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<void>(`${this.basePath}/DeleteAccount`, { params });
    }
}
