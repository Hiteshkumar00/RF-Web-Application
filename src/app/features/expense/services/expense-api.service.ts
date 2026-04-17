import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExpenseDto, ExpenseListDto } from '../models/expense.model';
import { CreateExpenseDto } from '../models/expense-create.dto';
import { UpdateExpenseDto } from '../models/expense-update.dto';

@Injectable({
    providedIn: 'root'
})
export class ExpenseApiService {
    private readonly basePath = `${environment.apiUrl}/BusinessExpence`;
    private http = inject(HttpClient);

    getAll(): Observable<ExpenseListDto[]> {
        return this.http.get<ExpenseListDto[]>(`${this.basePath}/GetAll`);
    }

    getById(id: number): Observable<ExpenseDto> {
        return this.http.get<ExpenseDto>(`${this.basePath}/GetById?id=${id}`);
    }

    create(dto: CreateExpenseDto): Observable<number> {
        return this.http.post<number>(`${this.basePath}/Create`, dto);
    }

    update(dto: UpdateExpenseDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.basePath}/Update`, dto);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.basePath}/Delete?id=${id}`);
    }

    getExpenceTypeSuggestions(): Observable<string[]> {
        return this.http.get<string[]>(`${this.basePath}/GetExpenceTypeSuggestions`);
    }
}
