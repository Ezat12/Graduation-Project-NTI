import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorRoutingModule } from "../../../instructor/instructor-routing-module";
import { Iuser } from '../../service/Model/iuser';
import { UserApiServices } from '../../service/user-api-services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InstructorRoutingModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private userService: UserApiServices){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  onSubmit() {
    if(this.registerForm.valid) {
      const userData: Iuser = this.registerForm.value
      this.userService.registerUser(userData).subscribe({
        next: res => {
          console.log("response: ", res);
          alert('Account Created Successfully')
          this.router.navigate(['/login'])          
        },
        error: err => {
          console.error("error: ", err);
          alert('Something Went Wrong: ' + err.error.message)
        }
      })
    }
  }

  get name(){
    return this.registerForm.get('name')
  }

  get email(){
    return this.registerForm.get('email')
  }

  get password(){
    return this.registerForm.get('password')
  }
}


