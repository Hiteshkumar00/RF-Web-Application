import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
    RemoveContributionDto, 
    RemoveContributionListDto, 
    CreateRemoveContributionDto, 
    UpdateRemoveContributionDto 
} from '../models/remove-contribution.model';

@Injectable({
    providedIn: 'root'
})
export class RemoveContributionApiService {
    private readonly basePath = `${environment.apiUrl}/RemoveContribution`;
    private http = inject(HttpClient);

    getAll(): Observable<RemoveContributionListDto[]> {
        return this.http.get<RemoveContributionListDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<RemoveContributionDto> {
        return this.http.get<RemoveContributionDto>(`${this.basePath}/GetById/${id}`);
    }

    getAllByAccountPersonId(accountPersonId: number): Observable<RemoveContributionListDto[]> {
        return this.http.get<RemoveContributionListDto[]>(`${this.basePath}/GetAllByAccountPersonId/${accountPersonId}`);
    }

    create(dto: CreateRemoveContributionDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateRemoveContributionDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete?id=${id}`);
    }
}
