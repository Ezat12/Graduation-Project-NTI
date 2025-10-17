import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Iuser } from '../../Model/i-user';
import { UserService } from '../../service/user-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile implements OnInit {
  user: Iuser | null = null;
  isLoading = true;
  editForm: FormGroup;
  passwordForm: FormGroup;
  editMode = false;
  passwordMode = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.editForm.patchValue({ name: this.user?.name, email: this.user?.email });
      this.isLoading = false;
    } else {
      this.userService.getProfile().subscribe({
        next: (res) => {
          this.user = res.data || res;
          this.editForm.patchValue({name: this.user?.name, email: this.user?.email });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          this.isLoading = false;
        },
      });
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    if (this.editForm.invalid) return;
    const updatedData = this.editForm.value;
    this.userService.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.user = { ...this.user, ...updatedData };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.editMode = false;
      },
      error: (err) => console.error('Error updating profile:', err)
    });
  }

  togglePassword() {
    this.passwordMode = !this.passwordMode;
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    this.userService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.passwordMode = false;
        this.passwordForm.reset();
      },
      error: (err) => console.error('Error changing password:', err)
    });
  }
}