import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css',
})
export class CourseCard {
  @Input() course: any;

  constructor() {}

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/default-course.jpg';
  }

  viewCourseDetails(course: any) {}

  enrollInCourse(course: any) {}
}
