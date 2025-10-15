import { Routes } from '@angular/router';
import { Contact } from './Student/Component/contact/contact';
// import { Courses } from './Student/Component/courses/courses';
import { StudentCoursesComponent } from './Student/Component/student-courses/student-courses.component';

export const routes: Routes = [
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor-module').then((m) => m.InstructorModule),
  },

  { path: 'courses', component: StudentCoursesComponent , title:"Courses" },
  { path: 'contact', component: Contact , title:"Contact"},
      { path: '**', redirectTo: 'Contact',},
    { path: '', redirectTo: 'courses', pathMatch: 'full' },
];
