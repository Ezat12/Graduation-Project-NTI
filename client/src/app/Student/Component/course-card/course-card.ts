import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css',
})
export class CourseCard {
  @Input() course: any;
   @Output() courseClicked = new EventEmitter<ICourse>();

  constructor(private router: Router) {}
 
  //   onCardClick() {
  //   this.courseClicked.emit(this.course);
  // }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/default-course.jpg';
  }

  viewCourseDetails(course: any) {
  this.router.navigate(['/courses', course._id]);

  }

  enrollInCourse(course: any) {}
}
