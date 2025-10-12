import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor-module').then((m) => m.InstructorModule),
  },
];
