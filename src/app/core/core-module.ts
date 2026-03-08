import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { apiInterceptor } from './interceptors/api.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([apiInterceptor]))
  ]
})
export class CoreModule { }
