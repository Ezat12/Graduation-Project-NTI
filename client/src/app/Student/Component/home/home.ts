import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICourse } from '../../service/Model/i-course';
import { CourseService } from '../../service/courses-service';
import { Itutor } from '../../service/Model/itutor';
import { TutorService } from '../../service/tutor-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  courses: ICourse[] = []
  tutors: Itutor[] = []

  constructor(private courseService: CourseService, private tutorService: TutorService){}

  ngOnInit(): void {
    this.loadCourses()
    this.loadTutors()
  }

    loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: res => {
        this.courses = (res.data ?? res).slice(0, 3);
      },
      error: err => console.log(err)
    });
  }

  loadTutors(): void {
    this.tutorService.getInstructors().subscribe({
      next: res => {
        this.tutors = (res.data ?? res).slice(0, 3);
      },
      error: err => console.log(err)
    });
  }
}


