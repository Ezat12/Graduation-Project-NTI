import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorRoutingModule } from '../../../instructor/instructor-routing-module';
// import { Iuser } from '../../modules/user';
import { UserApiServices } from '../../../services/user-api-services';
import { Iuser } from '../../Model/i-user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InstructorRoutingModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserApiServices,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: Iuser = this.registerForm.value;
      this.userService.registerUser(userData).subscribe({
        next: (res: any) => {
          console.log('response: ', res);
          this.toastr.success('Account Created Successfully', 'Success');
          if (res.role === 'instructor') {
            this.router.navigate(['/instructor/login']);
          } else {
            this.router.navigate(['/']);
          }
          localStorage.setItem('token', res.token);
          console.log(res);
        },
        error: (err) => {
          console.error('error: ', err);
          this.toastr.error('Something Went Wrong: ' + err.error.message, 'Error');
        },
      });
    }
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get role() {
    return this.registerForm.get('role');
  }
}
