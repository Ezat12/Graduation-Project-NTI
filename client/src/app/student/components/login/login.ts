import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorRoutingModule } from "../../../instructor/instructor-routing-module";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, InstructorRoutingModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if(this.loginForm.valid){
      alert('login successful!')
      this.router.navigate(['/student'])
    }
  }

  get email() {
    return this.loginForm.get('email')
  }

    get password() {
    return this.loginForm.get('password')
  }
}
