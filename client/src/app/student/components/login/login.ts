import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorRoutingModule } from '../../../instructor/instructor-routing-module';
import { UserApiServices } from '../../../services/user-api-services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, InstructorRoutingModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserApiServices,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;

      this.userService.loginUser(userData).subscribe({
        next: (res) => {
          console.log('login response: ', res);
          if (res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.toastr.success('Login Successful');
            if (res.user.role === 'instructor') {
              this.router.navigate(['/instructor/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.toastr.error('Login Failed');
          }
        },
        error: (err) => {
          console.error('login error: ', err);
          this.toastr.error('Invalid Email or Password');
        },
      });
    } else {
      console.error('form is invalid');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
