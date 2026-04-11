import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DropdownOption } from '../models/dropdown-option.model';

@Injectable({
    providedIn: 'root'
})
export class DropdownService {
    private http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getPaymentAccountOptions(): Observable<DropdownOption[]> {
        return this.http.get<any[]>(`${this.apiUrl}/PaymentAccount/GetAll`).pipe(
            map(data => (data ?? []).map(item => ({
                label: item.methodName,
                value: item.id
            })))
        );
    }

    getAgencyOptions(): Observable<DropdownOption[]> {
        return this.http.get<any[]>(`${this.apiUrl}/Agency/GetAll`).pipe(
            map(data => (data ?? []).map(item => ({
                label: item.agencyName,
                value: item.id
            })))
        );
    }

    getAccountPersonOptions(): Observable<DropdownOption[]> {
        return this.http.get<any[]>(`${this.apiUrl}/AccountPerson/GetAll`).pipe(
            map(data => (data ?? []).map(item => ({
                label: item.name,
                value: item.id
            })))
        );
    }

    getAccountOptions(): Observable<DropdownOption[]> {
        return this.http.get<any[]>(`${this.apiUrl}/Account/GetAll`).pipe(
            map(data => (data ?? []).map(item => ({
                label: item.profileName,
                value: item.id
            })))
        );
    }

    getOptionsByEntityName(entityName: string): Observable<DropdownOption[]> {
        return this.http.get<any>(`${this.apiUrl}/Entity/GetByEntityName`, {
            params: { entityName }
        }).pipe(
            map(data => (data?.relatedEntities ?? []).map((re: any) => ({
                label: re.relatedDisplayName ? `${re.relatedEntityName} (${re.relatedDisplayName})` : re.relatedEntityName,
                value: re.relatedEntityName
            })))
        );
    }
}
