import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../service/courses-service';
import { CourseCard } from '../../Component/course-card/course-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, CourseCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  courses: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.getAllCourses();
    console.log(this.courses);
  }
  getAllCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses: any) => {
        this.courses = courses.data;
        console.log(courses);
      },
    });
  }
}
