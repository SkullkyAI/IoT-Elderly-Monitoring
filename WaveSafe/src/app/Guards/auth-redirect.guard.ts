
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // Si existe un token, redirigir al dashboard o página principal
      this.router.navigate(['/home']);
      return false;
    }

    // Si no hay token, permitir acceso al login
    return true;
  }
}
