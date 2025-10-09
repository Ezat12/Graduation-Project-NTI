import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorRoutingModule } from "../../../instructor/instructor-routing-module";

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InstructorRoutingModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router){
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required, Validators.minLength(5)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  onSubmit() {
    if(this.registerForm.valid) {
      alert('Account Created Successfully')
      this.router.navigate(['/login'])
    }
  }

  get fullName(){
    return this.registerForm.get('fullName')
  }

  get email(){
    return this.registerForm.get('email')
  }

  get password(){
    return this.registerForm.get('password')
  }
}


