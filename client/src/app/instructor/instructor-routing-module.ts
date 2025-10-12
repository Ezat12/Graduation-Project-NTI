import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Home } from './components/home/home';
import { Courses } from './components/courses/courses';
import { CreateCourse } from './components/create-course/create-course';
import { Student } from './components/student/student';
import { Rating } from './components/rating/rating';
import { Setting } from './components/setting/setting';

const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'courses',
        component: Courses,
      },
      {
        path: 'courses/create',
        component: CreateCourse,
      },
      {
        path: 'student',
        component: Student,
      },
      {
        path: 'rating',
        component: Rating,
      },
      {
        path: 'setting',
        component: Setting,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorRoutingModule {}
