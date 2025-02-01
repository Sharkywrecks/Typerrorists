import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../shared/models/user';
import { IVoter } from '../shared/models/voter';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  private currentVoterSource = new BehaviorSubject<IVoter | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  currentVoter$ = this.currentVoterSource.asObservable();
  userId!: string;

  constructor(private http: HttpClient, 
              private router: Router,
              private toastr: ToastrService, ) { }

  loadCurrentUser(token: string | null) {
    if (!token) {
      this.currentUserSource.next(null);  // No token, user is not logged in
      return of(null);
    }
  
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        } else {
          this.currentUserSource.next(null);
        }
        this.userId = user.voterId;
          this.getVoterInfo(this.userId).subscribe({
            next:(voter: IVoter) => {
            this.currentVoterSource.next(voter);
            this.router.navigateByUrl('/instructions');
          }
        });
        return user;
      }),
      catchError(error => {
        console.error('Error fetching user', error);
        this.currentUserSource.next(null);
        return of(null);  // Handle error and continue with null user
      })
    );
  }
  
  login(values: any): Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map(() => {
        this.toastr.success('Email confirmation sent. Please check your email.');
      }),
      catchError((error) => {
        this.toastr.error('Email could not be sent:', error);
        return of();
      })
    );
  }

  verifyEmail(token: string, userId: string): Observable<void> {
    const payload = { userId, token };
    return this.http.post<IUser>(this.baseUrl + 'account/confirm-email', payload).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.userId = user.voterId;
          this.getVoterInfo(this.userId).subscribe({
            next:(voter: IVoter) => {
            this.currentVoterSource.next(voter);
          },
          error:(error) => {
            this.toastr.error('Error verifying email:', error);
        }});
        }
      })
    );
  }

  getVoterInfo(voterId: string): Observable<IVoter> {
    return this.http.get<IVoter>(this.baseUrl + 'voters/' + voterId);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.currentVoterSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  updateVoter(voter: IVoter) {
    this.currentVoterSource.next(voter);
  }
}
