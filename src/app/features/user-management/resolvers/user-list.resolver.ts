import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UserApiService } from '../Services/user-api.service';
import { UserDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserListResolver implements Resolve<UserDto[]> {
  private apiService = inject(UserApiService);

  resolve(): Observable<UserDto[]> {
    return this.apiService.getAll();
  }
}
