import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessYearApiService } from '../services/business-year-api.service';
import { BusinessYearListDto } from '../models/business-year-list-dto.model';

@Injectable({ providedIn: 'root' })
export class BusinessYearListResolver implements Resolve<BusinessYearListDto[]> {
  private apiService = inject(BusinessYearApiService);

  resolve(): Observable<BusinessYearListDto[]> {
    return this.apiService.getAll();
  }
}
