import { Component } from '@angular/core';
import { InstructorRoutingModule } from '../../../instructor/instructor-routing-module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [InstructorRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router:Router) {}

  logout() {
    localStorage.removeItem('token');
     this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  goToProfile(){
    this.router.navigate(['/student-profile'])
  }
}
