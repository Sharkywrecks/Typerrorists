import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../shared/models/user';
import { Client } from '../client.api';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router,
    private client: Client
  ) { }
  
  loadCurrentUser(token: string | null) {
    if (!token) {
      this.currentUserSource.next(null);  // No token, user is not logged in
      return of(null);
    }
    
    return this.client.account().pipe(
      map(user => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        } else {
          this.currentUserSource.next(null);
        }
        return user;
      }),
      catchError(() => {
        this.currentUserSource.next(null);
        return of(null);  // Handle error and continue with null user
      })
    );
  }

  login(values: any) {
    return this.client.login(values).pipe(
      map((user: IUser) => {
        if (user) {
          if (user.token && values.rememberMe) {
            localStorage.setItem('token', user.token);
          }
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.client.register(values).pipe(
      map((user: IUser) => {
        if (user) {
          if (user.token && values.rememberMe) {
            localStorage.setItem('token', user.token);
          }
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.client.emailexists(email);
  }
}
