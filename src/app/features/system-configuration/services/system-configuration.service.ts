import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SystemConfiguration, UpdateSystemConfigurationDto } from '../models/system-configuration';
import { ServiceResponse } from '../../../shared/models/service-response.model';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigurationService {
  private apiUrl = `${environment.apiUrl}/SystemConfiguration`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<SystemConfiguration[]> {
    return this.http.get<SystemConfiguration[]>(`${this.apiUrl}/GetAll`);
  }

  updateMultiple(dtos: UpdateSystemConfigurationDto[]): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/UpdateMultiple`, dtos);
  }
}
