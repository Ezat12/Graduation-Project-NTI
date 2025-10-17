import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserApiServices } from '../../../services/user-api-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css',
})
export class CourseCard implements OnInit {
  @Input() course: any;
  coursesUser: any[] = [];

  constructor(private userApiServices: UserApiServices, private router: Router) {}

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/default-course.jpg';
  }

  ngOnInit() {
    this.getCoursesUser();
  }

  getCoursesUser() {
    this.userApiServices.getCoursesUser().subscribe({
      next: (res: any) => {
        this.coursesUser = res.data[0]?.courses || [];
        console.log(res);
      },
      error: (error: any) => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        console.error('Error fetching courses:', error);
      },
    });
  }

  isEnrolled(courseId: string): boolean {
    console.log('Checking enrollment for courseId:', courseId);
    console.log('User enrolled courses:', this.coursesUser);
    return this.coursesUser.some((course) => course._id.toString() === courseId);
  }

  viewCourseDetails(course: any) {}

  purchaseCourse(course: any) {}
}
