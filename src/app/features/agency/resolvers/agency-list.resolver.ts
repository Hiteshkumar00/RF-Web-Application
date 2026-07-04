import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AgencyApiService } from '../services/agency-api.service';
import { AgencyDto } from '../models/agency.model';

@Injectable({ providedIn: 'root' })
export class AgencyListResolver implements Resolve<AgencyDto[]> {
  private apiService = inject(AgencyApiService);

  resolve(): Observable<AgencyDto[]> {
    return this.apiService.getAll();
  }
}
