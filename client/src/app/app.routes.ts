import { Routes } from '@angular/router';
import { Home } from './student/components/home/home';
import { Login } from './student/components/login/login';
import { Register } from './student/components/register/register';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home Page' },
  { path: 'login', component: Login, title: 'Login Page' },
  { path: 'register', component: Register, title: 'Sign Up Page' },
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor-routing-module').then((m) => m.InstructorRoutingModule),
  },
];
