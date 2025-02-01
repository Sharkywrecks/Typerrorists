import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { map, switchMap, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  const platformId = inject(PLATFORM_ID);

  return accountService.currentUser$.pipe(
    switchMap(auth => {
      if (auth) {
        return of(true);  // User is authenticated
      } else {
        if (isPlatformBrowser(platformId)) {
          // Only access localStorage if in browser environment
          const token = localStorage.getItem('token');
          if (token) {
            // Load the current user and return the observable
            return accountService.loadCurrentUser(token).pipe(
              map(user => {
                if (user) {
                  return true;  // User is authenticated after loading
                } else {
                  router.navigate(['login'], { queryParams: { returnUrl: state.url } });
                  return false;
                }
              })
            );
          } else {
            router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return of(false);  // No token, redirect to login
          }
        } else {
          // If not in browser environment, can't access localStorage
          router.navigate(['login'], { queryParams: { returnUrl: state.url } });
          return of(false);  // Redirect to login
        }
      }
    })
  );
};
