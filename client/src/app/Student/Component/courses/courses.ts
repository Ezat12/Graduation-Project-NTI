import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../../service/courses-service';
import { ICourse } from '../../Model/i-course';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
})
export class Courses implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  filterForm: FormGroup;

  constructor(private service: CourseService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      category: [''],
      language: [''],
      rating: [''],
      priceType: [''],
      maxPrice: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.service.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = [...this.courses];
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });

    this.filterForm.get('priceType')?.valueChanges.subscribe((val) => {
      const maxPriceControl = this.filterForm.get('maxPrice');
      if (val === 'paid') {
        maxPriceControl?.enable();
      } else {
        maxPriceControl?.disable();
        maxPriceControl?.reset();
      }
    });

    this.filterForm.get('maxPrice')?.disable();
  }

  applyFilters() {
    const { category, language, rating, priceType, maxPrice } = this.filterForm.value;

    this.filteredCourses = this.courses.filter((course) => {
      const priceTypeMatch =
        priceType === 'free' ? course.price === 0 : priceType === 'paid' ? course.price > 0 : true;

      const maxPriceMatch = maxPrice ? course.price <= +maxPrice : true;

      return (
        (!category || course.category.toLowerCase().includes(category.toLowerCase())) &&
        (!language || course.language.toLowerCase().includes(language.toLowerCase())) &&
        (!rating || course.rating >= +rating) &&
        priceTypeMatch &&
        maxPriceMatch
      );
    });
  }

  resetFilters() {
    this.filterForm.reset();
    this.filterForm.get('maxPrice')?.disable();
    this.filteredCourses = [...this.courses];
  }
}
