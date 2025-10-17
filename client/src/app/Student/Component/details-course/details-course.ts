import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../service/courses-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-course',
  imports: [CommonModule, RouterLink],
  templateUrl: './details-course.html',
  styleUrl: './details-course.css',
})
export class DetailsCourse {
  course: any;
  activeTab = 'contents';
  isLoading = true;
  expandedLecture: string | null = null;
  currentVideo: string | null = null;

  constructor(private route: ActivatedRoute, private service: CourseService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.service.getCourseById(id).subscribe({
        next: (res: any) => {
          console.log('course details:', res);
          this.course = res.data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error fetching course:', err);
          this.isLoading = false;
        },
      });
    }
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }

  toggleLecture(lecture: any) {
    if (this.expandedLecture === lecture._id) {
      this.expandedLecture = null;
      this.currentVideo = null;
    } else {
      this.expandedLecture = lecture._id;
    }
  }

  playVideo(lecture: any) {
    this.currentVideo = lecture._id;
    this.expandedLecture = lecture._id;
  }

  purchaseCourse() {
    if (this.course.price === 0) {
      console.log('Enrolling in free course:', this.course._id);
      alert('Successfully enrolled in the course!');
    } else {
      console.log('Purchasing course:', this.course._id);
      alert('Redirecting to checkout...');
    }
  }
}
