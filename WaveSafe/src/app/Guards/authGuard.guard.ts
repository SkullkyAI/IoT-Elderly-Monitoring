import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(payload.exp);
    return expirationDate < new Date();
  } catch {
    return true;
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
