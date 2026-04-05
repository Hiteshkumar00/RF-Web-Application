import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map, catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { ServiceResponse } from '../../shared/models/service-response.model';



export const apiInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const loader = inject(LoaderService);
    const errorDialog = inject(ErrorDialogService);


    // 1. Attach Bearer token
    const token = localStorage.getItem('accessToken');
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    // 2. Show global loader
    loader.show();

    return next(authReq).pipe(
        // 3. Unwrap ServiceResponse<T> — pass only .data to subscribers
        //    If success === false, show error dialog and swallow the response
        map((event: HttpEvent<unknown>) => {
            if (event instanceof HttpResponse) {
                const body = event.body as ServiceResponse<unknown>;
                if (body && body.success === false && body.message) {
                    errorDialog.show(body.message);
                    // Return null body so the subscriber receives nothing on failure
                    return event.clone({ body: null });
                }
                if (body && 'data' in body) {
                    return event.clone({ body: body.data });
                }
            }
            return event;
        }),
        // 4. Handle HTTP-level errors
        catchError((err) => {
            const raw: string =
                err?.error?.message ||
                err?.message ||
                'An unexpected error occurred.';
            errorDialog.show(raw);
            return throwError(() => err);
        }),
        finalize(() => loader.hide())
    );
};
