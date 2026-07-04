import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductApiService } from '../services/product-api.service';
import { ProductDto } from '../models/product.dto';

@Injectable({ providedIn: 'root' })
export class ProductListResolver implements Resolve<ProductDto[]> {
  private apiService = inject(ProductApiService);

  resolve(): Observable<ProductDto[]> {
    return this.apiService.getAll();
  }
}
