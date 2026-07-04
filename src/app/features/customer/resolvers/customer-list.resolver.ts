import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerApiService } from '../services/customer-api.service';
import { CustomerListDto } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerListResolver implements Resolve<CustomerListDto[]> {
  private apiService = inject(CustomerApiService);

  resolve(): Observable<CustomerListDto[]> {
    return this.apiService.getAll();
  }
}
