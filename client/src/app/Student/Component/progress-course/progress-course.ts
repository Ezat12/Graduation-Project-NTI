import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface Lecture {
  _id: string;
  title: string;
  freePreview: boolean;
  videoUrl: string;
  duration?: number;
  completed?: boolean;
}

interface Course {
  _id: string;
  title: string;
  instructorId: string;
  imageUrl: string;
  description: string;
  price: number;
  category: string[];
  language: string[];
  level: string;
  objective: string[];
  lectures: Lecture[];
  enrollments: number;
  reviewsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  _id?: string;
  rating: number;
  comment: string;
  userId?: string;
  userName?: string;
  createdAt?: string;
}

interface ReviewResponse {
  status: string;
  data: Review[];
}

@Component({
  selector: 'app-progress-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progress-course.html',
  styleUrls: ['./progress-course.css'],
})
export class ProgressCourseComponent implements OnInit {
  course: any = null;
  isLoading = true;
  errorMessage = '';
  selectedLecture: Lecture | null = null;

  // Review properties
  showReviewModal = false;
  reviews: Review[] = [];
  review: Review = {
    rating: 0,
    comment: '',
  };
  hoverRating = 0;
  isSubmittingReview = false;

  private apiUrl = 'http://localhost:3000/api/v1/studentCourse/progress';
  private reviewsApiUrl = 'http://localhost:3000/api/v1/reviews';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCourseProgress();
  }

  loadCourseProgress(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (!courseId) {
      this.errorMessage = 'Course ID not found';
      this.isLoading = false;
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(`${this.apiUrl}/${courseId}`, { headers }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.course = response.data;
          this.course.lectures = this.course.lectures.map((lecture: any) => ({
            ...lecture,
            completed: false,
          }));
          if (this.course.lectures.length > 0) {
            this.selectedLecture = this.course.lectures[0];
          }

          this.loadReviews(courseId);
        } else {
          this.errorMessage = response.message;
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.errorMessage = error.error?.message || 'Failed to load course';
        this.isLoading = false;
      },
    });
  }

  loadReviews(courseId: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<ReviewResponse>(`${this.reviewsApiUrl}/course/${courseId}`, { headers })
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.reviews = response.data;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading reviews:', error);
          this.reviews = [];
          this.isLoading = false;
        },
      });
  }

  selectLecture(lecture: Lecture): void {
    this.selectedLecture = lecture;
  }

  markAsCompleted(lecture: Lecture): void {
    lecture.completed = !lecture.completed;
    this.toastr.success(`Lecture ${lecture.completed ? 'completed' : 'marked as incomplete'}!`);
  }

  openReviewModal(): void {
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.review = { rating: 0, comment: '' };
    this.hoverRating = 0;
    this.isSubmittingReview = false;
  }

  setRating(rating: number): void {
    this.review.rating = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  submitReview(): void {
    if (this.review.rating === 0) {
      this.toastr.error('Please select a rating');
      return;
    }

    if (!this.review.comment.trim()) {
      this.toastr.error('Please write a comment');
      return;
    }

    this.isSubmittingReview = true;
    const courseId = this.route.snapshot.paramMap.get('id');

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const reviewData = {
      rating: this.review.rating,
      comment: this.review.comment.trim(),
      courseId: courseId,
    };

    this.http.post<any>(`${this.reviewsApiUrl}/${courseId}`, reviewData, { headers }).subscribe({
      next: (response) => {
        this.toastr.success('Review submitted successfully!');

        if (response.data) {
          this.reviews.unshift(response.data);
        }

        if (this.course) {
          this.course.reviewsCount += 1;
          this.course.rating =
            (this.course.rating * (this.course.reviewsCount - 1) + this.review.rating) /
            this.course.reviewsCount;
        }

        this.closeReviewModal();
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        const errorMessage = error.error?.message || 'Failed to submit review';
        this.toastr.error(errorMessage);
        this.isSubmittingReview = false;
      },
    });
  }

  getProgressPercentage(): number {
    if (!this.course?.lectures.length) return 0;
    const completed = this.course.lectures.filter((lecture: any) => lecture.completed).length;
    return (completed / this.course.lectures.length) * 100;
  }

  getCompletedLecturesCount(): number {
    return this.course?.lectures.filter((lecture: any) => lecture.completed).length || 0;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
