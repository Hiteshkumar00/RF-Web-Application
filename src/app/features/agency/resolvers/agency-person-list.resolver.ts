import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AgencyPersonApiService } from '../services/agency-person-api.service';
import { AgencyPersonDto } from '../models/agency-person.model';

@Injectable({ providedIn: 'root' })
export class AgencyPersonListResolver implements Resolve<AgencyPersonDto[]> {
  private apiService = inject(AgencyPersonApiService);

  resolve(): Observable<AgencyPersonDto[]> {
    return this.apiService.getAll();
  }
}
