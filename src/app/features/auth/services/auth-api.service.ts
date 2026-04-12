import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginUserDto } from '../models/auth.models';
import { EntityApiService } from '../../entity/services/entity-api.service';
import { DropdownOption } from '../../../shared/models/dropdown-option.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private authBasePath = `${environment.apiUrl}/Auth`;

    private http = inject(HttpClient);
    private entityApiService = inject(EntityApiService);
    private authService = inject(AuthService);

    constructor() { }

    login(dto: LoginUserDto): Observable<string> {
        return this.http.post<string>(`${this.authBasePath}/Login`, dto);
    }

    loginAsAdmin(accountId: number): Observable<string> {
        return this.http.post<string>(`${this.authBasePath}/LoginAsAdmin`, {}, {
            params: { accountId: accountId.toString() }
        });
    }

    loginAsSuperAdmin(): Observable<string> {
        return this.http.post<string>(`${this.authBasePath}/LoginAsSuperAdmin`, {});
    }

    getUserRoleOptions(): Observable<DropdownOption[]> {
        return this.entityApiService.getByEntityName('UserRole').pipe(
            map(entity => {
                const allOptions: DropdownOption[] = (entity.relatedEntities ?? []).map(re => ({
                    label: re.relatedDisplayName ?? re.relatedEntityName,
                    value: re.relatedEntityName
                }));

                return this.authService.currentUser?.id === '-1'
                    ? allOptions
                    : allOptions.filter(o => o.value !== 'SuperAdmin');
            })
        );
    }
}
