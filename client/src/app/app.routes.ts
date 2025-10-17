import { Routes } from '@angular/router';
import { Contact } from './Student/Component/contact/contact';
// import { Courses } from './Student/Component/courses/courses';
import { StudentCoursesComponent } from './Student/Component/student-courses/student-courses.component';
import { Home } from './Student/components/home/home';
import { Login } from './Student/components/login/login';
import { Register } from './Student/components/register/register';
import { MyCourses } from './Student/Component/my-courses/my-courses';

export const routes: Routes = [
  {
    path: 'instructor',
    loadChildren: () => import('./instructor/instructor-module').then((m) => m.InstructorModule),
  },
  { path: '', component: Home, title: 'Home Page' },
  { path: 'login', component: Login, title: 'Login Page' },
  { path: 'register', component: Register, title: 'Sign Up Page' },

  { path: 'courses', component: StudentCoursesComponent, title: 'Courses' },
  { path: 'contact', component: Contact, title: 'Contact' },
  { path: 'my-courses', component: MyCourses, title: 'My Courses' },
  { path: '**', redirectTo: 'Contact' },
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
];
