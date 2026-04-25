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

  update(dto: UpdateSystemConfigurationDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/Update`, dto);
  }

  getValue(propertyName: string): Observable<string> {
    return new Observable<string>(observer => {
      this.getAll().subscribe({
        next: (res) => {
          const config = res.find((c: SystemConfiguration) => c.propertyName === propertyName);
          observer.next(config?.propertyValue || '');
          observer.complete();
        },
        error: () => {
          observer.next('');
          observer.complete();
        }
      });
    });
  }
}
