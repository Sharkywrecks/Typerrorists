import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable, throwError } from "rxjs";

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router = inject(Router);
    const toastr = inject(ToastrService)
    return next(req).pipe(
        catchError(error => {
            if (error) {
                switch (error.status) {
                    case 400:
                        if (error.error.errors) {
                            throw error.error;
                        }
                        toastr.error(error.error.message, error.error.statusCode)
                        break;
                    case 401:
                        toastr.error(error.error.message, error.error.statusCode)
                        break;
                    case 404:
                        //router.navigateByUrl('/not-found');
                        break;
                    case 500:
                        const navigationExtras: NavigationExtras = {state: {error: error.error}};
                        //router.navigateByUrl('/server-error', navigationExtras);
                        toastr.error("Please check that you are currently logged in", error.error.statusCode)
                        break;
                    default:
                        //router.navigateByUrl('/not-found');
                        //console.log(error);
                        break;
                }
            }
            router.navigateByUrl('/login');
            return throwError(() => error);
        })
    );
  }
