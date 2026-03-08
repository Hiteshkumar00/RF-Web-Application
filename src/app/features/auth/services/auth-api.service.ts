import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginUserDto } from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private authBasePath = `${environment.apiUrl}/Auth`;

    private http = inject(HttpClient);

    constructor() { }

    login(dto: LoginUserDto): Observable<string> {
        return this.http.post<string>(`${this.authBasePath}/Login`, dto);
    }
}
