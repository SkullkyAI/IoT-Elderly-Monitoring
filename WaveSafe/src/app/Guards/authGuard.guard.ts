import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = localStorage.getItem('token');
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return true;
  }

  return true;
};
