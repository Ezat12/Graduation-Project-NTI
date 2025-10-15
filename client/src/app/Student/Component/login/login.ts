import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorRoutingModule } from "../../../instructor/instructor-routing-module";
import { UserApiServices } from '../../service/user-api-services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, InstructorRoutingModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private userService: UserApiServices){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit() {
    console.log('form submitted: ', this.loginForm.value);
    
    if(this.loginForm.valid){
      const userData = this.loginForm.value

      this.userService.loginUser(userData).subscribe({
        next: res => {
          console.log('login response: ', res);
          if(res.token){
            localStorage.setItem('token', res.token)
            localStorage.setItem('user', JSON.stringify(res.user))
            alert("Login Successful")
            this.router.navigate(['/'])
          } else {
            alert('Login Failed')
          }
        },
        error: err => {
          console.error('login error: ', err);
          alert('Invalid Email or Password')
          
        }
      })
    } else {
      console.error('form is invalid');
      
    }
  }

  get email() {
    return this.loginForm.get('email')
  }

    get password() {
    return this.loginForm.get('password')
  }
}
