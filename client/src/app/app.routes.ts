import { Routes } from '@angular/router';
import { Contact } from './Student/Component/contact/contact';
// import { Courses } from './Student/Component/courses/courses';
import { StudentCoursesComponent } from './Student/Component/student-courses/student-courses.component';
import { Home } from './Student/components/home/home';
import { Login } from './Student/components/login/login';
import { Register } from './Student/components/register/register';
import { MyCourses } from './Student/Component/my-courses/my-courses';
import { About } from './Student/components/about/about';
import { DetailsCourse } from './Student/Component/details-course/details-course';

export const routes: Routes = [
  {
    path: 'instructor',
    loadChildren: () => import('./instructor/instructor-module').then((m) => m.InstructorModule),
  },
  { path: '', component: Home, title: 'Home Page' },
  { path: 'login', component: Login, title: 'Login Page' },
  { path: 'register', component: Register, title: 'Sign Up Page' },

  { path: 'courses', component: StudentCoursesComponent, title: 'Courses' },
  { path: 'details/:id', component: DetailsCourse, title: 'Course Details' },
  { path: 'contact', component: Contact, title: 'Contact' },
  { path: 'about', component: About, title: 'About' },
  { path: 'my-courses', component: MyCourses, title: 'My Courses' },
  { path: '**', redirectTo: 'Contact' },
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
];
