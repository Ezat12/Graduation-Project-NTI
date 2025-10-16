import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../services/user';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';

export const instructorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(User);
  const toaster = inject(ToastrService);

  return userService.getUser().pipe(
    map((res: any) => {
      if (res?.data?.role === 'instructor') {
        return true;
      } else {
        toaster.error('Access Denied! You are not an Instructor');
        router.navigate(['/']);
        return false;
      }
    }),
    catchError((err) => {
      toaster.error('Access Denied! Please log in.');
      router.navigate(['/login']);
      return of(false);
    })
  );
};
