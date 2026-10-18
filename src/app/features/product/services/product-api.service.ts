import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductDto, CreateProductDto, UpdateProductDto, ProductFilterDto } from '../models/product.dto';
import { SKIP_LOADER } from '../../../core/interceptors/api.interceptor';

@Injectable({
    providedIn: 'root'
})
export class ProductApiService {
    private readonly basePath = `${environment.apiUrl}/Product`;
    private http = inject(HttpClient);

    getAll(request: any): Observable<{ data: ProductDto[], totalRecords: number }> {
        return this.http.post<{ data: ProductDto[], totalRecords: number }>(`${this.basePath}/GetAll`, request);
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

    getSuggestions(searchTerm: string, includeIds?: number[]): Observable<ProductDto[]> {
        let params = new HttpParams();
        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }
        if (includeIds && includeIds.length > 0) {
            includeIds.forEach(id => {
                params = params.append('includeIds', id.toString());
            });
        }
        return this.http.get<ProductDto[]>(`${this.basePath}/GetSuggestions`, { 
            params
        });
    }

    export(filter?: ProductFilterDto): Observable<Blob> {
        let params = new HttpParams();
        if (filter?.searchTerm) {
            params = params.set('searchTerm', filter.searchTerm);
        }
        return this.http.get(`${this.basePath}/Export`, { params, responseType: 'blob' });
    }

    import(dtos: any[]): Observable<any> {
        return this.http.post<any>(`${this.basePath}/Import`, dtos);
    }

    migratePrice(payload: { productIds: number[], marginPercentage: number }): Observable<boolean> {
        return this.http.post<boolean>(`${this.basePath}/MigratePrice`, payload);
    }
}
