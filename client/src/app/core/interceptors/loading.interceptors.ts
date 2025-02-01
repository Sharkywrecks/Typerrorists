import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { finalize, Observable } from "rxjs";
import { BusyService } from "../services/busy.service";
import { inject } from "@angular/core";

export function loadingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const busyService = inject(BusyService);

    if (req.method === 'DELETE') {
        return next(req);
    }

    if (req.method === 'POST' && req.url.includes('orders')) {
        return next(req);
    }
    
    if (req.url.includes('emailexists')) {
        return next(req);
    }

    busyService.busy();
    
    return next(req).pipe(
        finalize(() => {
            busyService.idle();
        })
    );
}