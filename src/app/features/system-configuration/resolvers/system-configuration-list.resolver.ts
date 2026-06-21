import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemConfigurationService } from '../services/system-configuration.service';
import { SystemConfiguration } from '../models/system-configuration';

@Injectable({ providedIn: 'root' })
export class SystemConfigurationListResolver implements Resolve<SystemConfiguration[]> {
  private apiService = inject(SystemConfigurationService);

  resolve(): Observable<SystemConfiguration[]> {
    return this.apiService.getAll();
  }
}
