import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { apiInterceptor } from './interceptors/api.interceptor';
import { formCleaningInterceptor } from './interceptors/form-cleaning.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([formCleaningInterceptor, apiInterceptor])),
    ConfirmationService,
    MessageService
  ]
})
export class CoreModule { }
