import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserApiServices } from '../../../services/user-api-services';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './course-card.html',
  standalone: true,
  styleUrl: './course-card.css',
})
export class CourseCard implements OnInit {
  @Input() course: any;
  @Output() purchase = new EventEmitter<any>();
  coursesUser: any[] = [];

  constructor(
    private userApiServices: UserApiServices,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/default-course.jpg';
  }

  ngOnInit() {
    this.getCoursesUser();
  }

  getCoursesUser() {
    if (localStorage.getItem('token')) {
      this.userApiServices.getCoursesUser().subscribe({
        next: (res: any) => {
          this.coursesUser = res.data[0]?.courses || [];
        },
        error: (error: any) => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          console.error('Error fetching courses:', error);
        },
      });
    }
  }

  isEnrolled(courseId: string): boolean {
    return this.coursesUser.some((course) => course._id.toString() === courseId);
  }

  purchaseCourse(course: any) {
    if (!localStorage.getItem('token')) {
      this.toastr.error('You need to be logged in to purchase a course.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Emitting purchase event for course:', course);
    this.purchase.emit(course);
  }
}
