import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoveContributionApiService } from '../services/remove-contribution-api.service';
import { RemoveContributionListDto } from '../models/remove-contribution.model';

@Injectable({ providedIn: 'root' })
export class RemoveContributionListResolver implements Resolve<RemoveContributionListDto[]> {
  private apiService = inject(RemoveContributionApiService);

  resolve(): Observable<RemoveContributionListDto[]> {
    return this.apiService.getAll();
  }
}
