import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CustomerDto, CreateCustomerDto, UpdateCustomerDto, CustomerListDto } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private readonly basePath = `${environment.apiUrl}/Customer`;
  private http = inject(HttpClient);

  getAll(): Observable<CustomerListDto[]> {
    return this.http.get<CustomerListDto[]>(`${this.basePath}/GetAll`);
  }

  getById(id: number): Observable<CustomerDto> {
    return this.http.get<CustomerDto>(`${this.basePath}/GetById/${id}`);
  }

  create(dto: CreateCustomerDto): Observable<number> {
    return this.http.post<number>(`${this.basePath}/Create`, dto);
  }

  update(dto: UpdateCustomerDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.basePath}/Update`, dto);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.basePath}/Delete/${id}`);
  }
}
