import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductDto, CreateProductDto, UpdateProductDto, ProductFilterDto } from '../models/product.dto';

@Injectable({
    providedIn: 'root'
})
export class ProductApiService {
    private readonly basePath = `${environment.apiUrl}/Product`;
    private http = inject(HttpClient);

    getAll(filter?: ProductFilterDto): Observable<ProductDto[]> {
        let params = new HttpParams();
        if (filter?.searchTerm) {
            params = params.set('searchTerm', filter.searchTerm);
        }
        return this.http.get<ProductDto[]>(`${this.basePath}/GetAll`, { params });
    }

    getById(id: number): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${this.basePath}/GetById/${id}`);
    }

    create(dto: CreateProductDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateProductDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete/${id}`);
    }

    getSuggestions(searchTerm: string): Observable<ProductDto[]> {
        let params = new HttpParams().set('searchTerm', searchTerm || '');
        return this.http.get<ProductDto[]>(`${this.basePath}/GetSuggestions`, { params });
    }
}
