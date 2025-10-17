import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/v1/courses';
  private token = localStorage.getItem('token') || '';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
     const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers });
  }

getCourseById(id: string): Observable<any> {
  const token = localStorage.getItem('token'); 
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token} `
  });

  return this.http.get(`${this.apiUrl}/${id}`, { headers });
}

}
