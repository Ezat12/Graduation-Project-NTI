import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { User } from '../../services/user';
import { DataUser } from '../../models/user';

@Component({
  selector: 'app-setting',
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.html',
  styleUrl: './setting.css'
})
export class Setting implements OnInit {
  dataUser: DataUser | null = null;
  isLoading: boolean = false;
  isUpdating: boolean = false;
  isChangingPassword: boolean = false;
  updateMessage: string = '';
  passwordMessage: string = '';

  updateForm = {
    name: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private user: User,
    private toastr: ToastrService
  ) {};

  ngOnInit(): void {
    this.getDataUser();
  }

  getDataUser() {
    this.isLoading = true;
    this.user.getUser().subscribe({
      next: (data) => {
        this.dataUser = data;
        if (data) {
          this.updateForm.name = data.name;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.log("Error loading user data:", error);
        this.isLoading = false;
        this.toastr.error('Failed to load user data', 'Error');
      }
    });
  }

  updateProfile() {
    if (!this.dataUser || !this.updateForm.name.trim()) {
      this.toastr.warning('Name is required!', 'Validation Error');
      return;
    }

    this.isUpdating = true;
    this.updateMessage = '';

    this.user.updateUser({ name: this.updateForm.name }).subscribe({
      next: (updatedUser) => {
        this.dataUser = updatedUser;
        this.isUpdating = false;

        this.toastr.success('Name updated successfully!', 'Success');
      },
      error: (error) => {
        console.log("Error updating profile:", error);
        console.log("Error status:", error.status);
        console.log("Error body:", error.error);

        let errorMessage = 'Failed to update name. Please try again.';

        if (error.status === 400) {
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors?.[0]?.msg) {
            errorMessage = error.error.errors[0].msg;
          } else if (error.error?.errors?.[0]?.message) {
            errorMessage = error.error.errors[0].message;
          } else {
            errorMessage = 'Invalid request. Please check your input.';
          }
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#ef4444'
        });

        this.isUpdating = false;
      }
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toastr.warning('New passwords do not match!', 'Validation Error');
      return;
    }

    this.isChangingPassword = true;
    this.passwordMessage = '';

    this.user.updatePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: (response) => {
        this.isChangingPassword = false;

        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        this.toastr.success('Password changed successfully!', 'Success');
      },
      error: (error) => {
        console.log("Error changing password:", error);
        console.log("Error status:", error.status);
        console.log("Error body:", error.error);

        let errorMessage = 'Failed to change password. Please try again.';

        // Check for HTTP error response
        if (error.status === 400) {
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors?.[0]?.msg) {
            errorMessage = error.error.errors[0].msg;
          } else if (error.error?.errors?.[0]?.message) {
            errorMessage = error.error.errors[0].message;
          } else {
            errorMessage = 'Invalid request. Please check your input.';
          }
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#ef4444'
        });

        this.isChangingPassword = false;
      }
    });
  }

  // refreshUserData() {
  //   this.user.refreshUser().subscribe({
  //     next: (user) => {
  //       this.dataUser = user;
  //       this.updateForm.name = user.name;
  //     },
  //     error: (error) => {
  //       console.log("Error refreshing user data:", error);
  //     }
  //   });
  // }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
