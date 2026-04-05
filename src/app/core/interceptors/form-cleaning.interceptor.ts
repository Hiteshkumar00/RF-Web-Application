import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Recursively cleans the request body:
 * 1. Trims all strings.
 * 2. Converts empty strings (or whitespace-only) to null.
 * 
 * This helps the backend by:
 * - Preventing unnecessary leading/trailing spaces in DB.
 * - Avoiding validation errors on nullable fields where empty strings might fail.
 */
function cleanBody(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    
    // Skip non-plain objects that shouldn't be processed
    if (obj instanceof Date || obj instanceof Blob || obj instanceof File) return obj;

    // Handle Arrays
    if (Array.isArray(obj)) {
        return obj.map(item => cleanBody(item));
    }

    // Handle Objects
    if (typeof obj === 'object') {
        const clean: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                let val = obj[key];
                
                if (typeof val === 'string') {
                    const trimmed = val.trim();
                    clean[key] = trimmed === '' ? null : trimmed;
                } else if (typeof val === 'object' && val !== null) {
                    clean[key] = cleanBody(val);
                } else {
                    clean[key] = val;
                }
            }
        }
        return clean;
    }

    return obj;
}

export const formCleaningInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    
    // Only process requests that have a body and are JSON-compatible
    // Skip FormData as it's typically used for file uploads and shouldn't be mutated this way
    if (req.body && typeof req.body === 'object' && !(req.body instanceof FormData) && !(req.body instanceof Blob)) {
        const cleanedBody = cleanBody(req.body);
        const clonedReq = req.clone({ body: cleanedBody });
        return next(clonedReq);
    }

    return next(req);
};
