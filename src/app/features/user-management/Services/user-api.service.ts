import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserDto } from '../models/user.model';
import { CreateUserDto } from '../models/user-create.dto';
import { UpdateUserDto } from '../models/user-update.dto';
import { ResetPasswordBySuperAdminDto } from '../models/reset-password.dto';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    private readonly basePath = `${environment.apiUrl}/Auth`;
    private http = inject(HttpClient);

    getAll(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<UserDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<UserDto>(`${this.basePath}/GetUserById`, { params });
    }

    create(dto: CreateUserDto): Observable<void> {
        return this.http.post<void>(`${this.basePath}/CreteUser`, dto);
    }

    update(dto: UpdateUserDto): Observable<void> {
        return this.http.put<void>(`${this.basePath}/UpdateUser`, dto);
    }

    delete(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<void>(`${this.basePath}/DeleteUser`, { params });
    }

    activateDeactivate(id: number): Observable<void> {
        const params = new HttpParams().set('Id', id.toString());
        return this.http.post<void>(`${this.basePath}/ActivateDeactivateUser`, null, { params });
    }

    resetPassword(dto: ResetPasswordBySuperAdminDto): Observable<void> {
        return this.http.post<void>(`${this.basePath}/ResetPasswordBySuperAdmin`, dto);
    }
}
