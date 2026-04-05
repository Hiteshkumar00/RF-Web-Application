import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateBusinessYearDto } from '../models/create-business-year-dto.model';
import { UpdateBusinessYearDto } from '../models/update-business-year-dto.model';
import { BusinessYearListDto } from '../models/business-year-list-dto.model';
import { ChangeUserSelectedYearDto } from '../models/change-user-selected-year-dto.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessYearApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<BusinessYearListDto[]> {
    return this.http.get<BusinessYearListDto[]>(`${this.apiUrl}/BusinessYear/GetAll`);
  }

  create(dto: CreateBusinessYearDto): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/BusinessYear/Create`, dto);
  }

  update(dto: UpdateBusinessYearDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/BusinessYear/Update`, dto);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/BusinessYear/Delete?id=${id}`);
  }

  changeSelectedYear(dto: ChangeUserSelectedYearDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/BusinessYear/ChangeSelectedYear`, dto);
  }
}
