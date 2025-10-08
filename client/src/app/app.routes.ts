import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor-routing-module').then((m) => m.InstructorRoutingModule),
  },
];
