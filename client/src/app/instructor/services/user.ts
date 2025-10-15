import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { DataUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class User {
  private userCache$ = new BehaviorSubject<DataUser | null>(null);
  private baseUrl = 'http://localhost:3000/api/v1';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQyZWU4NTZmZjc1OGYxZWI1MDI2YjkiLCJpYXQiOjE3NjA1Mzk0NTIsImV4cCI6MTc2MDcxMjI1Mn0.v_LczTzCb98hxFEPoUZ2T06vSxrBqvMIy3ysfsDbGsY';

  constructor(private http : HttpClient) {};

  getUser(): Observable<DataUser | null> {
    if (!this.userCache$.value) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
      this.http.get<{ data: DataUser }>(`${this.baseUrl}/auth/me`, { headers })
        .pipe(map(res => res.data))
        .subscribe(user => this.userCache$.next(user));
    }
  
    return this.userCache$.asObservable();
  }

  refreshUser(): Observable<DataUser> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.get<{ data: DataUser }>(`${this.baseUrl}/auth/me`, { headers }).pipe(
      map(res => res.data),
      tap(user => this.userCache$.next(user))
    );
  }

  updateUser(userData: { name: string }): Observable<DataUser> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.put<{ data: DataUser }>(`${this.baseUrl}/auth/update-me`, userData, { headers }).pipe(
      map(res => res.data),
      tap(user => this.userCache$.next(user))
    );
  }

  updatePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.patch(`${this.baseUrl}/auth/change-password`, passwordData, { headers });
  }

  clearCache() {
    this.userCache$.next(null);
  }

}
