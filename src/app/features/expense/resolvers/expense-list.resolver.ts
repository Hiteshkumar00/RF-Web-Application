import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpenseApiService } from '../services/expense-api.service';
import { ExpenseListDto } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseListResolver implements Resolve<ExpenseListDto[]> {
  private apiService = inject(ExpenseApiService);

  resolve(): Observable<ExpenseListDto[]> {
    return this.apiService.getAll();
  }
}
