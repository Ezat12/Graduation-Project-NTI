import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../service/courses-service';
import { CourseCard } from '../course-card/course-card';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface ICategory {
  _id: string;
  name: string;
}

interface IInstructor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ILecture {
  _id: string;
  title: string;
  freePreview: boolean;
  videoUrl: string;
}

interface ICourse {
  _id: string;
  title: string;
  instructorId: IInstructor;
  imageUrl: string;
  description: string;
  price: number;
  category: ICategory[];
  language: string[];
  level: string;
  objective: string[];
  lectures: ILecture[];
  enrollments: number;
  reviewsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  isEnrolled?: boolean;
}

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CourseCard],
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css'],
})
export class StudentCoursesComponent implements OnInit {
  courses: any[] = [];
  course: any = null;
  filteredCourses: any[] = [];
  isLoading = true;

  showPaymentForm = false;
  selectedCourse: any = null;
  paymentForm: FormGroup; // إضافة FormGroup للدفع

  categories: string[] = [];
  languages: string[] = [];
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  selectedLevels: string[] = [];

  filterForm: FormGroup;

  constructor(
    private service: CourseService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private ngZone: NgZone
  ) {
    // Filter Form
    this.filterForm = this.fb.group({
      category: [''],
      language: [''],
      rating: [''],
      minPrice: [''],
      maxPrice: [''],
    });

    // Payment Form مع Validation
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      expiryDate: ['', [Validators.required]],
      cvc: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3,4}$/),
          Validators.minLength(3),
          Validators.maxLength(4),
        ],
      ],
      cardholderName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)],
      ],
      country: ['', [Validators.required]],
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
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
      },
    });
  }

  extractFilterOptions(): void {
    const allCategories = this.courses.flatMap(
      (course) => course.category?.map((cat: any) => cat.name) || []
    );
    this.categories = [...new Set(allCategories)];

    const allLanguages = this.courses.flatMap((course) => course.language || []);
    this.languages = [...new Set(allLanguages)];
  }

  applyFilters(): void {
    const { category, language, rating, minPrice, maxPrice } = this.filterForm.value;

    this.filteredCourses = this.courses.filter((course) => {
      const categoryMatch = !category || course.category?.some((cat: any) => cat.name === category);

      const languageMatch = !language || course.language?.includes(language);

      const ratingMatch = !rating || course.rating >= +rating;
      const minPriceMatch = !minPrice || course.price >= +minPrice;
      const maxPriceMatch = !maxPrice || course.price <= +maxPrice;

      const levelMatch =
        this.selectedLevels.length === 0 || this.selectedLevels.includes(course.level);

      return (
        categoryMatch &&
        languageMatch &&
        ratingMatch &&
        minPriceMatch &&
        maxPriceMatch &&
        levelMatch
      );
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      category: '',
      language: '',
      rating: '',
      minPrice: '',
      maxPrice: '',
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
      this.selectedLevels = this.selectedLevels.filter((l) => l !== level);
    }
    this.applyFilters();
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.applyFilters();
      return;
    }

    this.filteredCourses = this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructorId?.name.toLowerCase().includes(searchTerm) ||
        course.category?.some((cat: any) => cat.name.toLowerCase().includes(searchTerm)) ||
        course.objective?.some((obj: any) => obj.toLowerCase().includes(searchTerm))
    );
  }

  viewCourseDetails(course: ICourse): void {
    console.log('View course details:', course);
  }

  enrollInCourse(course: ICourse): void {
    console.log('Enroll in course:', course);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/default-course.jpg';
  }

  ///////// Payment Form Logic /////////
  onPurchase(course: any) {
    console.log('Purchase event received:', course);
    this.course = course;
    this.openPaymentForm(course);
  }

  openPaymentForm(course: any) {
    console.log('Opening payment form for course:', course);
    this.selectedCourse = course;
    this.showPaymentForm = true;
    this.paymentForm.reset(); // reset النموذج عند الفتح
  }

  closePaymentForm() {
    this.showPaymentForm = false;
    this.selectedCourse = null;
    this.paymentForm.reset(); // reset النموذج عند الإغلاق
  }

  // دالة format لرقم البطاقة
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      value = parts.join(' ');
    }

    this.paymentForm.patchValue({ cardNumber: value });
  }

  // دالة format لتاريخ الانتهاء
  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    this.paymentForm.patchValue({ expiryDate: value });
  }

  // دالة format لـ CVC
  formatCVC(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    this.paymentForm.patchValue({ cvc: value });
  }

  // التحقق من صلاحية التاريخ
  validateExpiryDate(): boolean {
    const expiryDate = this.paymentForm.get('expiryDate')?.value;
    if (!expiryDate) return true;

    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

    return true;
  }

  pay() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.paymentForm.controls).forEach((key) => {
      this.paymentForm.get(key)?.markAsTouched();
    });

    // if (!this.validateExpiryDate()) {
    //   alert('❌ Card has expired. Please check the expiry date.');
    //   return;
    // }

    if (this.paymentForm.valid) {
      console.log('Processing payment for:', this.selectedCourse);
      console.log('Form data:', this.paymentForm.value);

      console.log(this.selectedCourse.id);

      // Simulate payment processing
      this.service.purchaseCourse(this.course._id).subscribe({
        next: (res: any) => {
          console.log('🟢 NEXT - Payment successful:', res);
          this.toastr.success('✅ Payment successful!');
          this.router.navigate(['/my-courses']);
        },
        error: (error) => {
          console.error('🔴 ERROR - Payment error:', error);
          this.toastr.error('❌ Payment failed.');
        },
        complete: () => {
          console.log('🟡 COMPLETE - Subscription completed');
          this.toastr.success('✅ Payment successful!');
          this.router.navigate(['/my-courses']);
        },
      });
    } else {
      console.log('Form is invalid');
      this.toastr.error('❌ Please fill all required fields correctly.');
    }
  }

  // Helper methods للوصول إلى الـ form controls في الـ template
  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }
  get expiryDate() {
    return this.paymentForm.get('expiryDate');
  }
  get cvc() {
    return this.paymentForm.get('cvc');
  }
  get cardholderName() {
    return this.paymentForm.get('cardholderName');
  }
  get country() {
    return this.paymentForm.get('country');
  }
  get email() {
    return this.paymentForm.get('email');
  }
}
