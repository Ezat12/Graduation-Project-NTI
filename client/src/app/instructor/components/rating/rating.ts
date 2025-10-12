import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Instructor } from '../../services/instructor';

@Component({
  selector: 'app-rating',
  imports: [CommonModule, FormsModule],
  templateUrl: './rating.html',
  styleUrl: './rating.css'
})
export class Rating implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  courses: any[] = [];
  average: number = 0;
  ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingPercentages: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  selectedCourseId: string = '';
  isLoading: boolean = false;

  constructor(private instructor: Instructor) {};

  ngOnInit() {
    this.getReviewInstructor();
    this.loadCourses();
  }

  getReviewInstructor() {
    this.isLoading = true;
    this.instructor.getReviewsInstructor().subscribe({
      next: (data: any) => {
        this.reviews = data.data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  loadCourses() {
    this.instructor.getInstructorCourses().subscribe({
      next: (response: any) => {
        this.courses = response?.data || [];
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  applyFilter() {
    // Filter reviews based on selected course
    if (this.selectedCourseId) {
      this.filteredReviews = this.reviews.filter(review => 
        review.courseId._id === this.selectedCourseId
      );
    } else {
      this.filteredReviews = [...this.reviews];
    }
    
    this.calculateRatingStats();
  }

  onCourseFilterChange() {
    this.applyFilter();
  }

  clearFilter() {
    this.selectedCourseId = '';
    this.applyFilter();
  }

  calculateRatingStats() {
    if (this.filteredReviews.length === 0) {
      this.average = 0;
      this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      this.ratingPercentages = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      return;
    }

    // Calculate average
    const sum = this.filteredReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    this.average = Math.round((sum / this.filteredReviews.length) * 10) / 10;

    // Calculate distribution
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.filteredReviews.forEach(review => {
      this.ratingDistribution[review.rating]++;
    });

    // Calculate percentages
    Object.keys(this.ratingDistribution).forEach(rating => {
      const ratingNum = parseInt(rating);
      this.ratingPercentages[ratingNum] = Math.round((this.ratingDistribution[ratingNum] / this.filteredReviews.length) * 100);
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
