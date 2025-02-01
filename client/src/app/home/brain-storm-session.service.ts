import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../shared/models/user';
import { Client, StormDto } from '../client.api';

@Injectable({
  providedIn: 'root'
})
export class BrainStormSessionService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router,
    private client: Client
  ) { }
  
  getBrainStormSessions() {
    return this.client.brainStormSession().pipe(
      map(sessions => {
        return sessions;
      }),
      catchError(() => {
        return of(null);  // Handle error and continue with null user
      })
    );
  }

  getStorms(id: string) {
    return this.client.storm(id).pipe(
      map(storms => {
        return storms;
      }),
      catchError(() => {
        return of(null);  // Handle error and continue with null user
      })
    );
  }

  createStorm(prompt: string): Observable<StormDto[]> {
    return this.client.createStorm(prompt).pipe(
      map((storm: StormDto[]) => {
        return storm;
      })
    );
  }
}
