import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Instructor } from '../../services/instructor';
// import { Instructor } from '../../../services/instructor';

@Component({
  selector: 'app-coursesv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coursesv.html',
  styleUrl: './coursesv.css'
})
export class CoursesV implements OnInit {
  courses: any[] = [];
  isLoading = false;

  constructor(private instructorService: Instructor, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.instructorService.getInstructorCourses().subscribe({
      next: (res: any) => {
        this.courses = res?.data || [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  goEdit(course: any) {
    this.router.navigate(['/instructor/dashboard/courses', course._id, 'edit']);
  }
}


