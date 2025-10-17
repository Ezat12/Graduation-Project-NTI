import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iuser } from '../Model/i-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/v1/users';
      private token = localStorage.getItem('token') || '';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  updateProfile(data: Partial<Iuser>): Observable<Iuser> {
    const token = localStorage.getItem('token') ;
    const headers = new HttpHeaders({ Authorization:` Bearer ${token}` });
    return this.http.put<Iuser>(`${this.apiUrl}/me`, data, { headers });
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    const token = localStorage.getItem('token') ;
    const headers = new HttpHeaders({ Authorization:` Bearer ${token}` });
    return this.http.patch(`${this.apiUrl}/me/password`, data, { headers });
  }
}

