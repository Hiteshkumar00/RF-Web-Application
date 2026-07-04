import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { EntityApiService } from '../services/entity-api.service';
import { EntityDto } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class EntityListResolver implements Resolve<EntityDto[]> {
  private apiService = inject(EntityApiService);

  resolve(): Observable<EntityDto[]> {
    return this.apiService.getAll();
  }
}
