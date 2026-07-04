import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountApiService } from '../services/account-api.service';
import { AccountDto } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountListResolver implements Resolve<AccountDto[]> {
  private apiService = inject(AccountApiService);

  resolve(): Observable<AccountDto[]> {
    return this.apiService.getAll();
  }
}
