import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICourse } from '../Model/i-course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/v1/courses';
  private apiUrlPurchase = 'http://localhost:3000/api/v1/orders/purchase';
  private token = localStorage.getItem('token') || '';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(this.apiUrl, { headers });
  }

  getCourseById(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  purchaseCourse(courseId: string): Observable<any> {
    console.log('Purchasing course with ID:', courseId);
    console.log('Purchasing course with ID:', this.token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.post(`${this.apiUrlPurchase}/${courseId}`, { courseId }, { headers });
  }
}
