import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorRoutingModule } from './instructor-routing-module';
import { Dashboard } from './components/dashboard/dashboard';
import { Home } from './components/home/home';
import { Courses } from './components/courses/courses';
import { Student } from './components/student/student';
import { Rating } from './components/rating/rating';
import { Setting } from './components/setting/setting';
import { EditCourse } from './components/edit-course/edit-course';
import { CoursesV } from './components/coursesv/coursesv';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    InstructorRoutingModule,
    Dashboard,
    Home,
    Courses,
    Student,
    Rating,
    Setting,
    EditCourse,
    CoursesV
  ],
})
export class InstructorModule {}
