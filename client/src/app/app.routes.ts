import { Routes } from '@angular/router';
import { Contact } from './Student/Component/contact/contact';
import { Courses } from './Student/Component/courses/courses';

export const routes: Routes = [
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor-routing-module').then((m) => m.InstructorRoutingModule),
  },

  { path: 'courses', component: Courses , title:"Courses" },
  { path: 'contact', component: Contact , title:"Contact"},
      { path: '**', redirectTo: 'Contact',},
    { path: '', redirectTo: 'courses', pathMatch: 'full' },
];
