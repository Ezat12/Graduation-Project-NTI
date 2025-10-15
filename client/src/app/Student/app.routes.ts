import { Routes } from '@angular/router';
import { Contact } from './Component/contact/contact';
// import { Courses } from './Student/Component/courses/courses';
import { StudentCoursesComponent } from './Component/student-courses/student-courses.component';
import { Home } from './Component/home/home';
import { Login } from './Component/login/login';
import { Register } from './Component/register/register';
import { About } from './Component/about/about';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home Page' },
  { path: 'login', component: Login, title: 'Login Page' },
  { path: 'register', component: Register, title: 'Sign Up Page' },
  { path: 'about', component: About, title: 'About us Page' },
  {
    path: 'instructor',
    loadChildren: () =>
      import('../instructor/instructor-module').then((m) => m.InstructorModule),
  },

  { path: 'courses', component: StudentCoursesComponent , title:"Courses" },
  { path: 'contact', component: Contact , title:"Contact"},
      { path: '**', redirectTo: 'Contact',},
    { path: '', redirectTo: 'courses', pathMatch: 'full' },
];
