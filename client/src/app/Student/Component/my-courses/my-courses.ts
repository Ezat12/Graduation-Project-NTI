import { Component, OnInit } from '@angular/core';
import { UserApiServices } from '../../../services/user-api-services';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  imports: [RouterLink],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
})
export class MyCourses implements OnInit {
  courses: any[] = [];
  constructor(
    private userApiServices: UserApiServices,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('token') == null) {
      this.toastr.error('You are not logged in');
      this.router.navigate(['/login']);
      return;
    }
    this.getMyCourses();
  }

  getMyCourses() {
    this.userApiServices.getCoursesUser().subscribe({
      next: (res: any) => {
        this.courses = res.data[0]?.courses || [];
        console.log(res);
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
        this.toastr.error(error?.error?.message || 'Failed to load courses');
        this.router.navigate(['/']);
      },
    });
  }

  showCourse(course: any) {
    // this.router.navigate(['/course', course._id]);
  }
}
