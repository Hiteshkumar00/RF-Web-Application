import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EntityDto } from '../models/entity.model';
import { CreateEntityDto } from '../models/entity-create.dto';
import { UpdateEntityDto } from '../models/entity-update.dto';

@Injectable({
    providedIn: 'root'
})
export class EntityApiService {
    private readonly basePath = `${environment.apiUrl}/Entity`;
    private http = inject(HttpClient);

    getAll(): Observable<EntityDto[]> {
        return this.http.get<EntityDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<EntityDto> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.get<EntityDto>(`${this.basePath}/GetById`, { params });
    }

    getByEntityName(entityName: string): Observable<EntityDto> {
        const params = new HttpParams().set('entityName', entityName);
        return this.http.get<EntityDto>(`${this.basePath}/GetByEntityName`, { params });
    }

    create(dto: CreateEntityDto): Observable<EntityDto> {
        return this.http.post<EntityDto>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateEntityDto): Observable<EntityDto> {
        return this.http.put<EntityDto>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<void>(`${this.basePath}/Delete`, { params });
    }
}
