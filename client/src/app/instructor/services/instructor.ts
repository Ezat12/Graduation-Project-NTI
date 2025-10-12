import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';


interface Category {
  _id : string,
  name : string,
  description?: string,
}

@Injectable({
  providedIn: 'root',
})
export class Instructor {
  private baseUrl = 'http://localhost:3000/api/v1';
  private token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQyZWU4NTZmZjc1OGYxZWI1MDI2YjkiLCJpYXQiOjE3NjAyMDUwOTIsImV4cCI6MTc2MDM3Nzg5Mn0.VA5h_VS9iIbeH0eZRvO4qbpvw2S9zSUl1F01XS1iNgM';

  private coursesCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getInstructorCourses(): Observable<any> {
    if (this.coursesCache) {
      return of({ data: this.coursesCache });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.baseUrl}/courses/instructor/my-courses`, { headers }).pipe(
      tap((res: any) => {
        this.coursesCache = res.data;
      })
    );
  }

  getStudentToInstructor() : Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.baseUrl}/studentCourse/instructor/students`, { headers })
  }

  getReviewsInstructor() : Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.baseUrl}/reviews`, { headers })
  }

  getTimeSince(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - created.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);
    const months  = Math.floor(days / 30);
    const years   = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }

  createCourse(courseData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.post(`${this.baseUrl}/courses`, courseData, { headers }).pipe(
      tap((res: any) => {
        this.coursesCache = null;
      })
    );
  }

  uploadFileSingle(file: File): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/uploads/single`, formData, { headers });
  }

  getAllCategory() : Observable<Category[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { headers });
  }

  clearCache() {
    this.coursesCache = null;
  }
}
