import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../service/courses-service';
@Component({
  selector: 'app-course-details',
  imports: [CommonModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
})
export class CourseDetails implements OnInit {
  course: any;
  activeTab = 'contents';
  isLoading = true;

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
        error: (err) => {
          console.error('Error fetching course:', err);
          this.isLoading = false;
        }
      });
    }
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }
}