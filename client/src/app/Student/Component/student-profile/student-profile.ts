import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Iuser } from '../../Model/i-user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiServices } from '../../../services/user-api-services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css',
})
export class StudentProfile implements OnInit {
  user: Iuser | null = null;
  isLoading = true;
  editForm: FormGroup;
  passwordForm: FormGroup;
  editMode = false;
  passwordMode = false;

  constructor(
    private userService: UserApiServices,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.editForm.patchValue({ name: this.user?.name });
      this.isLoading = false;
    } else {
      this.userService.getProfile().subscribe({
        next: (res: any) => {
          this.user = res.data || res;
          this.editForm.patchValue({ name: this.user?.name });
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error fetching user profile:', err);
          this.toastr.error('Failed to load profile');
          this.isLoading = false;
        },
      });
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editForm.patchValue({ name: this.user?.name });
    }
  }

  togglePassword() {
    this.passwordMode = !this.passwordMode;
    if (!this.passwordMode) {
      this.passwordForm.reset();
    }
  }

  saveProfile() {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    const updatedData = this.editForm.value;
    console.log('Updated Data:', updatedData);

    this.userService.updateProfile(updatedData).subscribe({
      next: (res: any) => {
        console.log('Profile updated successfully:', res);

        this.user = { ...this.user, ...updatedData };
        localStorage.setItem('user', JSON.stringify(this.user));

        this.editMode = false;
        this.toastr.success('Profile updated successfully!');
      },
      error: (err: any) => {
        console.error('Error updating profile:', err);
        const errorMessage =
          err.error?.errors?.[0]?.message || err.error?.message || 'Failed to update profile';
        this.toastr.error(errorMessage);
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    const passwordData = this.passwordForm.value;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      this.toastr.error('New password and confirm password do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      this.toastr.error('New password must be at least 6 characters long.');
      return;
    }

    const changePasswordData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    this.userService.changePassword(changePasswordData).subscribe({
      next: (res: any) => {
        console.log('Password changed successfully:', res);
        this.toastr.success('Password changed successfully!');
        this.passwordMode = false;
        this.passwordForm.reset();
        localStorage.removeItem('token');
        this.toastr.info('Please log in again with your new password.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Error changing password:', err);
        const errorMessage =
          err.error?.errors?.[0]?.message || err.error?.message || 'Failed to change password';
        this.toastr.error(errorMessage);
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
