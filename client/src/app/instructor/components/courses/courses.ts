import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Instructor } from '../../services/instructor';

@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses: any[] = [];
  isLoading: boolean = false;
  selectedCourse: any = null;

  constructor(
    private instructorService: Instructor,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.instructorService.getInstructorCourses().subscribe({
      next: (response: any) => {
        this.courses = response?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load courses', 'Error');
      }
    });
  }

  editCourse(course: any) {
    this.selectedCourse = course;
    console.log('Editing course:', course);
  }

  deleteCourse(course: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${course.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting course:', course);
        this.toastr.success('Course deleted successfully!', 'Success');
      }
    });
  }

  viewCourse(course: any) {
    console.log('Viewing course:', course);
  }

  onImageError(event: any) {
    console.log('Image failed to load:', event.target.src);
    event.target.src = '/assets/default-course.jpg';
  }

  createCourse() {
    this.router.navigate(['/instructor/dashboard/courses/create']);
  }
}
