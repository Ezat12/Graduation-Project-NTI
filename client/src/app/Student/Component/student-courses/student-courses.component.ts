import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../../service/courses-service';
import { CourseCard } from "../course-card/course-card";
import { Router } from '@angular/router';

// interface ICategory {
//   _id: string;
//   name: string;
// }

// interface IInstructor {
//   _id: string;
//   name: string;
//   email: string;
//   avatar?: string;
// }

// interface ILecture {
//   _id: string;
//   title: string;
//   freePreview: boolean;
//   videoUrl: string;
// }

// interface ICourse {
//   _id: string;
//   title: string;
//   instructorId: IInstructor;
//   imageUrl: string;
//   description: string;
//   price: number;
//   category: ICategory[];
//   language: string[];
//   level: string;
//   objective: string[];
//   lectures: ILecture[];
//   enrollments: number;
//   reviewsCount: number;
//   rating: number;
//   createdAt: string;
//   updatedAt: string;
//   isFeatured?: boolean;
//   isEnrolled?: boolean;
// }

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CourseCard],
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCoursesComponent implements OnInit {
  courses: ICourse[] = [];
  filteredCourses: ICourse[] = [];
  isLoading = true;

  categories: string[] = [];
  languages: string[] = [];
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  selectedLevels: string[] = [];

  filterForm: FormGroup;

  constructor(private service: CourseService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      category: [''],
      language: [''],
      rating: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    // console.log(localStorage.getItem('token'));

    this.service.getCourses().subscribe({
      next: (data: any) => {
        this.courses = data.data;
        this.filteredCourses = [...this.courses];
        this.extractFilterOptions();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.isLoading = false;
      }
    });
  }

  extractFilterOptions(): void {
    const allCategories = this.courses.flatMap(course =>
      course.category?.map(cat => cat.name) || []
    );
    this.categories = [...new Set(allCategories)];

    const allLanguages = this.courses.flatMap(course => course.language || []);
    this.languages = [...new Set(allLanguages)];
  }

  applyFilters(): void {
    const { category, language, rating, minPrice, maxPrice } = this.filterForm.value;

    this.filteredCourses = this.courses.filter(course => {
      const categoryMatch = !category ||
        course.category?.some(cat => cat.name === category);

      const languageMatch = !language ||
        course.language?.includes(language);

      const ratingMatch = !rating || course.rating >= +rating;
      const minPriceMatch = !minPrice || course.price >= +minPrice;
      const maxPriceMatch = !maxPrice || course.price <= +maxPrice;

      const levelMatch = this.selectedLevels.length === 0 ||
                         this.selectedLevels.includes(course.level);

      return categoryMatch && languageMatch && ratingMatch &&
             minPriceMatch && maxPriceMatch && levelMatch;
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      category: '',
      language: '',
      rating: '',
      minPrice: '',
      maxPrice: ''
    });
    this.selectedLevels = [];
    this.filteredCourses = [...this.courses];
  }

  setRating(rating: number): void {
    const currentRating = this.filterForm.get('rating')?.value;
    const newRating = currentRating === rating.toString() ? '' : rating.toString();
    this.filterForm.patchValue({ rating: newRating });
    this.applyFilters();
  }

  onLevelChange(event: any, level: string): void {
    if (event.target.checked) {
      this.selectedLevels.push(level);
    } else {
      this.selectedLevels = this.selectedLevels.filter(l => l !== level);
    }
    this.applyFilters();
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.applyFilters();
      return;
    }

    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructorId?.name.toLowerCase().includes(searchTerm) ||
      course.category?.some(cat => cat.name.toLowerCase().includes(searchTerm)) ||
      course.objective?.some(obj => obj.toLowerCase().includes(searchTerm))
    );
  }

  //  viewCourseDetails(course: ICourse): void {
  //    this.router.navigate(['/course', course._id]);
  //   console.log('View course details:', course);
  // }

  enrollInCourse(course: ICourse): void {
    console.log('Enroll in course:', course);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/default-course.jpg';
  }
}
