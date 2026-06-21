import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountPersonApiService } from '../Services/account-person-api.service';
import { AccountPersonDto } from '../models/account-person.model';

@Injectable({ providedIn: 'root' })
export class AccountPersonListResolver implements Resolve<AccountPersonDto[]> {
  private apiService = inject(AccountPersonApiService);

  resolve(): Observable<AccountPersonDto[]> {
    return this.apiService.getAll();
  }
}
