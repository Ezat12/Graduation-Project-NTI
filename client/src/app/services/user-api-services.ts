import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
// import { Iuser } from '../student/modules/iuser';
import { Iuser } from '../Student/Model/i-user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiServices {
  private apiURL = `http://localhost:3000/api/v1`;

  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<Iuser> {
    return this.httpClient.get<Iuser>(this.apiURL);
  }

  getUser(id: string): Observable<Iuser> {
    return this.httpClient.get<Iuser>(`${this.apiURL}/${id}`);
  }

  createUser(userData: Iuser): Observable<Iuser> {
    return this.httpClient.post<Iuser>(this.apiURL, userData);
  }

  updateUser(id: string, userData: Iuser): Observable<Iuser> {
    return this.httpClient.put<Iuser>(`${this.apiURL}/${id}`, userData);
  }

  deleteUser(id: string): Observable<Iuser> {
    return this.httpClient.delete<Iuser>(`${this.apiURL}/${id}`);
  }

  registerUser(userData: Iuser): Observable<Iuser> {
    return this.httpClient.post<Iuser>(`${this.apiURL}/auth/signup`, userData);
  }

  loginUser(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string; user: Iuser }> {
    return this.httpClient.post<{ token: string; user: Iuser }>(
      `${this.apiURL}/auth/login`,
      credentials
    );
  }

  getCoursesUser(): Observable<any> {
    const header = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.httpClient.get<any>(`${this.apiURL}/studentCourse`, {
      headers: header,
    });
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get(`${this.apiURL}/auth/me`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching profile:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(data: any): Observable<Iuser> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.put<Iuser>(`${this.apiURL}/auth/update-me`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.patch(`${this.apiURL}/auth/change-password`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error changing password:', error);
        return throwError(() => error);
      })
    );
  }
}
