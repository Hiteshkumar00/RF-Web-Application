import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AddContributionApiService } from '../services/add-contribution-api.service';
import { AddContributionListDto } from '../models/add-contribution.model';

@Injectable({ providedIn: 'root' })
export class AddContributionListResolver implements Resolve<AddContributionListDto[]> {
  private apiService = inject(AddContributionApiService);

  resolve(): Observable<AddContributionListDto[]> {
    return this.apiService.getAll();
  }
}
