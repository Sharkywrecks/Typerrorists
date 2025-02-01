import { HttpEvent, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { Observable } from "rxjs";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export function jwtAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('token');

        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }
    return next(req);
}