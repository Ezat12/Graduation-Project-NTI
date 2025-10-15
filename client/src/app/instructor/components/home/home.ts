import { Component, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Instructor } from '../../services/instructor';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  courses: any[] = [];
  // students : number = 0;
  averageReviews: number = 0;
  students: any[] = [];
  // reviews :any[] = [];
  constructor(
    private instructor: Instructor,
    private toastr: ToastrService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.getCourses();
    this.getStudents();
    this.getAllReview();
  }

  private handleError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);

    if (error.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your session has expired. Please login again.',
        confirmButtonColor: '#ef4444',
        allowOutsideClick: false,
      }).then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/login']);
        });
      });
    } else if (error.status === 403) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'You do not have permission to access this resource.',
        confirmButtonColor: '#f59e0b',
      }).then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/login']);
        });
      });
    } else if (error.status === 500) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong. Please try again later.',
        confirmButtonColor: '#ef4444',
      }).then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/login']);
        });
      });
    } else {
      this.toastr.error(`Failed to load ${context}`, 'Error');
    }
  }

  getCourses() {
    this.instructor.getInstructorCourses().subscribe({
      next: (data: any) => (this.courses = data?.data || []),
      error: (err) => this.handleError(err, 'courses'),
    });
  }

  getStudents() {
    this.instructor.getStudentToInstructor().subscribe({
      next: (data: any) => {
        this.students = data?.data || [];
        console.log(this.students);
      },
      error: (err: any) => this.handleError(err, 'students'),
    });
  }

  getRecentStudents() {
    return this.students
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const studentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - studentDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  getAllReview() {
    this.instructor.getReviewsInstructor().subscribe({
      next: (data: any) => {
        if (data?.data && data.data.length > 0) {
          const len: number = data.data.length;
          const sum = data.data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
          this.averageReviews = sum / len;
          console.log(this.averageReviews);
        } else {
          this.averageReviews = 0;
        }
      },
      error: (err: any) => this.handleError(err, 'reviews'),
    });
  }

  handleTime(date: string) {
    this.instructor.getTimeSince(date);
  }
}
