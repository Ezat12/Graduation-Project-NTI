import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
    private apiUrl = 'http://localhost:3000/api/v1/users/instructors'; 
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQyZWU4NTZmZjc1OGYxZWI1MDI2YjkiLCJpYXQiOjE3NjA1Mzk0NTIsImV4cCI6MTc2MDcxMjI1Mn0.v_LczTzCb98hxFEPoUZ2T06vSxrBqvMIy3ysfsDbGsY'; 

  constructor(private httpClient: HttpClient) {}

  getInstructors(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    return this.httpClient.get(this.apiUrl, { headers });
  }
}
