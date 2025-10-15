import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Instructor } from '../../services/instructor';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css'
})
export class EditCourse implements OnInit {
  courseId: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  categories: any[] = [];
  isLoadingCategories: boolean = false;
  uploadingImage: boolean = false;

  form: any = {
    title: '',
    description: '',
    price: 0,
    level: '',
    language: ['English'],
    imageUrl: '',
    category: [],
    objective: [],
    lectures: []
  };

  constructor(
    private route: ActivatedRoute,
    private instructorService: Instructor,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.courseId) {
      this.toastr.error('Invalid course id');
      this.router.navigate(['/instructor/dashboard/courses']);
      return;
    }
    this.loadCourse();
    this.loadCategories();
  }

  loadCourse() {
    this.isLoading = true;
    this.instructorService.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        const c = res?.data || res;
        const normalizedCategory = (c?.category || []).map((item: any) => typeof item === 'string' ? item : item?._id).filter((v: any) => !!v);
        this.form = {
          title: c?.title || '',
          description: c?.description || '',
          price: c?.price || 0,
          level: c?.level || '',
          language: c?.language || ['English'],
          imageUrl: c?.imageUrl || '',
          category: normalizedCategory,
          objective: c?.objective || [],
          lectures: c?.lectures || []
        };
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load course');
        this.router.navigate(['/instructor/dashboard/courses']);
      }
    });
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.instructorService.getAllCategory().subscribe({
      next: (response: any) => {
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
      error: () => {
        this.categories = [];
        this.isLoadingCategories = false;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.uploadingImage = true;
    this.instructorService.uploadFileSingle(file).subscribe({
      next: (data: any) => {
        this.form.imageUrl = data?.data?.url || '';
        this.uploadingImage = false;
        this.toastr.success('Image uploaded');
      },
      error: () => {
        this.uploadingImage = false;
        this.toastr.error('Image upload failed');
      }
    });
  }

  removeImage() {
    this.form.imageUrl = '';
    const fileInput = document.getElementById('courseImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  triggerImagePicker() {
    const input = document.getElementById('courseImage') as HTMLInputElement;
    if (input) input.click();
  }

  onVideoSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    this.form.lectures[index] = this.form.lectures[index] || {};
    this.form.lectures[index].uploadingVideo = true;
    this.instructorService.uploadFileSingle(file).subscribe({
      next: (data: any) => {
        this.form.lectures[index].videoUrl = data?.data?.url || '';
        this.form.lectures[index].uploadingVideo = false;
        this.toastr.success(`Video for lecture ${index + 1} uploaded`);
      },
      error: () => {
        this.form.lectures[index].uploadingVideo = false;
        this.toastr.error('Video upload failed');
      }
    });
  }

  triggerVideoPicker(index: number) {
    const input = document.getElementById('lectureVideo_' + index) as HTMLInputElement;
    if (input) input.click();
  }

  removeVideo(index: number) {
    const fileInput = document.getElementById('lectureVideo_' + index) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    if (this.form.lectures[index]) {
      this.form.lectures[index].videoUrl = '';
      this.form.lectures[index].videoFile = undefined;
      this.form.lectures[index].uploadingVideo = false;
    }
    this.toastr.info(`Video removed from lecture ${index + 1}`);
  }

  addObjective() {
    this.form.objective.push('');
  }

  removeObjective(index: number) {
    this.form.objective.splice(index, 1);
  }

  addLecture() {
    this.form.lectures.push({ title: '', freePreview: false, videoUrl: '' });
  }

  removeLecture(index: number) {
    this.form.lectures.splice(index, 1);
  }

  toggleCategory(categoryId: string) {
    const currentIds: string[] = (this.form.category || []).map((v: any) => typeof v === 'string' ? v : v?._id).filter((v: any) => !!v);
    const idx = currentIds.indexOf(categoryId);
    if (idx > -1) {
      currentIds.splice(idx, 1);
    } else {
      currentIds.push(categoryId);
    }
    this.form.category = currentIds;
  }

  isCategorySelected(categoryId: string): boolean {
    const currentIds: string[] = (this.form.category || []).map((v: any) => typeof v === 'string' ? v : v?._id).filter((v: any) => !!v);
    return currentIds.includes(categoryId);
  }

  isAnyLectureUploading(): boolean {
    return (this.form.lectures || []).some((l: any) => l.uploadingVideo);
  }

  validateForm(): boolean {
    if (!this.form.title?.trim() || this.form.title.length < 4) {
      this.errorMessage = 'Title is required and must be at least 4 characters';
      return false;
    }
    if (!this.form.description?.trim()) {
      this.errorMessage = 'Description is required';
      return false;
    }
    if (this.form.price === null || this.form.price < 0) {
      this.errorMessage = 'Valid price is required and cannot be negative';
      return false;
    }
    if (!this.form.level) {
      this.errorMessage = 'Level is required';
      return false;
    }
    if (!this.form.category || this.form.category.length === 0) {
      this.errorMessage = 'At least one category is required';
      return false;
    }
    if (this.isAnyLectureUploading()) {
      this.errorMessage = 'Wait for videos to finish uploading';
      return false;
    }
    if ((this.form.lectures || []).length === 0) {
      this.errorMessage = 'At least one lecture is required';
      return false;
    }
    for (let i = 0; i < this.form.lectures.length; i++) {
      const lecture = this.form.lectures[i];
      if (!lecture.title?.trim() || lecture.title.length < 4) {
        this.errorMessage = `Lecture ${i + 1}: Title is required and must be at least 4 characters`;
        return false;
      }
      if (!lecture.videoUrl) {
        this.errorMessage = `Lecture ${i + 1}: Video is required`;
        return false;
      }
    }
    this.errorMessage = '';
    return true;
  }

  save() {
    if (!this.validateForm()) {
      this.toastr.error(this.errorMessage || 'Fix the errors and try again', 'Validation Error');
      return;
    }
    this.isSaving = true;
    const payload = { ...this.form };
    this.instructorService.updateCourse(this.courseId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({ icon: 'success', title: 'Saved', timer: 1200, showConfirmButton: false });
        this.router.navigate(['/instructor/dashboard/courses']);
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Failed to save changes');
      }
    });
  }

  cancel() {
    this.router.navigate(['/instructor/dashboard/courses']);
  }
}


