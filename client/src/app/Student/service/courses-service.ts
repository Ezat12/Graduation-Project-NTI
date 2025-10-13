import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICourse } from '../Model/i-course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/v1/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
