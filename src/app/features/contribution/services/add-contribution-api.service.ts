import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
    AddContributionDto, 
    AddContributionListDto, 
    CreateAddContributionDto, 
    UpdateAddContributionDto 
} from '../models/add-contribution.model';

@Injectable({
    providedIn: 'root'
})
export class AddContributionApiService {
    private readonly basePath = `${environment.apiUrl}/AddContribution`;
    private http = inject(HttpClient);

    getAll(): Observable<AddContributionListDto[]> {
        return this.http.get<AddContributionListDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<AddContributionDto> {
        return this.http.get<AddContributionDto>(`${this.basePath}/GetById/${id}`);
    }

    getAllByAccountPersonId(accountPersonId: number): Observable<AddContributionListDto[]> {
        return this.http.get<AddContributionListDto[]>(`${this.basePath}/GetAllByAccountPersonId/${accountPersonId}`);
    }

    create(dto: CreateAddContributionDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateAddContributionDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete?id=${id}`);
    }
}
