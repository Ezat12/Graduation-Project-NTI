import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Instructor } from '../../services/instructor';

interface Lecture {
  title: string;
  freePreview: boolean;
  videoUrl: string;
  videoFile?: File;
  uploadingVideo?: boolean;
  public_id?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface CourseForm {
  title: string;
  description: string;
  price: number;
  category: string[];
  level: string;
  language: string[];
  imageUrl: string;
  objective: string[];
  lectures: Lecture[];
}

@Component({
  selector: 'app-create-course',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-course.html',
  styleUrl: './create-course.css'
})
export class CreateCourse implements OnInit {
  isCreating: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  submitted: boolean = false;
  courseImageFile: File | null = null;
  uploadingImage: boolean = false;
  categories: Category[] = [];
  isLoadingCategories: boolean = false;

  courseForm: CourseForm = {
    title: '',
    description: '',
    price: 0,
    category: [],
    level: '',
    language: ['English'],
    imageUrl: '',
    objective: [],
    lectures: []
  };

  constructor(
    private instructorService: Instructor,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.instructorService.getAllCategory().subscribe({
      next: (response: any) => {
        console.log('Categories response:', response);
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data;
        } else if (response && response.categories && Array.isArray(response.categories)) {
          this.categories = response.categories;
        } else {
          this.categories = [];
        }
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.isLoadingCategories = false;
        this.toastr.error('Failed to load categories', 'Error');
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.courseImageFile = file;
      this.uploadingImage = true;
      this.errorMessage = '';

      this.instructorService.uploadFileSingle(file).subscribe({
        next: (data: any) => {
          this.courseForm.imageUrl = data.data.url;
          this.uploadingImage = false;
          console.log('Image uploaded successfully:', data.data.url);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.uploadingImage = false;
          this.courseImageFile = null;
          this.toastr.error('Failed to upload image. Please try again.', 'Upload Error');
        }
      });
    }
  }

  removeImage() {
    this.courseImageFile = null;
    this.courseForm.imageUrl = '';
    this.uploadingImage = false;
    const fileInput = document.getElementById('courseImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onVideoSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.courseForm.lectures[index].videoFile = file;
      this.courseForm.lectures[index].uploadingVideo = true;
      this.errorMessage = '';

      this.instructorService.uploadFileSingle(file).subscribe({
        next: (data: any) => {
          this.courseForm.lectures[index].videoUrl = data.data.url;
          this.courseForm.lectures[index].uploadingVideo = false;
          console.log(`Video for lecture ${index + 1} uploaded:`, data.data.url);
        },
        error: (error) => {
          console.error('Error uploading video:', error);
          this.courseForm.lectures[index].uploadingVideo = false;
          this.courseForm.lectures[index].videoFile = undefined;
          this.toastr.error(`Failed to upload video for lecture ${index + 1}. Please try again.`, 'Upload Error');
        }
      });
    }
  }

  removeVideo(index: number) {
    this.courseForm.lectures[index].videoFile = undefined;
    this.courseForm.lectures[index].videoUrl = '';
    this.courseForm.lectures[index].uploadingVideo = false;
    const fileInput = document.getElementById('lectureVideo_' + index) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  addObjective() {
    this.courseForm.objective.push('');
  }

  removeObjective(index: number) {
    this.courseForm.objective.splice(index, 1);
  }

  addLecture() {
    this.courseForm.lectures.push({
      title: '',
      freePreview: false,
      videoUrl: ''
    });
  }

  removeLecture(index: number) {
    this.courseForm.lectures.splice(index, 1);
  }

  validateForm(): boolean {
    this.submitted = true;

    if (!this.courseForm.title.trim() || this.courseForm.title.length < 4) {
      this.errorMessage = 'Title is required and must be at least 4 characters';
      return false;
    }

    if (!this.courseForm.description.trim()) {
      this.errorMessage = 'Description is required';
      return false;
    }

    if (this.courseForm.price === null || this.courseForm.price < 0) {
      this.errorMessage = 'Valid price is required and cannot be negative';
      return false;
    }

    if (!this.courseForm.level) {
      this.errorMessage = 'Level is required';
      return false;
    }

    if (!this.courseForm.category || this.courseForm.category.length === 0) {
      this.errorMessage = 'At least one category is required';
      return false;
    }

    if (!this.courseImageFile || !this.courseForm.imageUrl) {
      this.errorMessage = 'Course image is required';
      return false;
    }

    if (this.courseForm.lectures.length === 0) {
      this.errorMessage = 'At least one lecture is required';
      return false;
    }

    for (let i = 0; i < this.courseForm.lectures.length; i++) {
      const lecture = this.courseForm.lectures[i];

      if (!lecture.title.trim() || lecture.title.length < 4) {
        this.errorMessage = `Lecture ${i + 1}: Title is required and must be at least 4 characters`;
        return false;
      }

      if (!lecture.videoFile || !lecture.videoUrl) {
        this.errorMessage = `Lecture ${i + 1}: Video file is required`;
        return false;
      }

      if (lecture.uploadingVideo) {
        this.errorMessage = `Lecture ${i + 1}: Video is still uploading`;
        return false;
      }
    }

    if (this.uploadingImage) {
      this.errorMessage = 'Course image is still uploading';
      return false;
    }

    return true;
  }

  createCourse() {
    if (!this.validateForm()) {
      this.toastr.error(this.errorMessage, 'Validation Error');
      return;
    }

    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';

    const courseData = {
      title: this.courseForm.title.trim(),
      description: this.courseForm.description.trim(),
      price: this.courseForm.price,
      level: this.courseForm.level,
      language: this.courseForm.language,
      imageUrl: this.courseForm.imageUrl,
      category: this.courseForm.category || [],
      objective: this.courseForm.objective.filter(obj => obj.trim() !== ''),
      lectures: this.courseForm.lectures.map(lecture => ({
        title: lecture.title.trim(),
        freePreview: lecture.freePreview,
        videoUrl: lecture.videoUrl,
        public_id: lecture.public_id
      }))
    };

    console.log('Course data being sent:', courseData);
    console.log('Categories array:', this.courseForm.category);

    this.instructorService.createCourse(courseData).subscribe({
      next: (response) => {
        this.isCreating = false;
        this.submitted = false;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Course created successfully!',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/instructor/dashboard/courses']);
        });
      },
      error: (error) => {
        console.log("Error creating course:", error);
        console.log("Error status:", error.status);
        console.log("Error body:", error.error);

        let errorMessage = 'Failed to create course. Please try again.';

        if (error.status === 400) {
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors && Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors.map((err: any) => err.message).join(', ');
          } else {
            errorMessage = 'Invalid request. Please check your input.';
          }
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#ef4444'
        });

        this.isCreating = false;
      }
    });
  }

  toggleCategory(categoryId: string) {
    const index = this.courseForm.category.indexOf(categoryId);
    if (index > -1) {
      this.courseForm.category.splice(index, 1);
    } else {
      this.courseForm.category.push(categoryId);
    }

    console.log(this.courseForm.category);
  }

  isCategorySelected(categoryId: string): boolean {
    return this.courseForm.category.includes(categoryId);
  }

  isAnyLectureUploading(): boolean {
    return (this.courseForm.lectures || []).some(lecture => lecture.uploadingVideo);
  }

  cancel() {
    this.router.navigate(['/instructor/dashboard/courses']);
  }
}
