import { Routes } from '@angular/router';
import { authGuard } from './guards/authGuard.guard';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';

export const routes: Routes = [
  {
    path:'login',
    loadComponent: () => import('./pages/loginPage/loginPage.component').then(m => m.LoginPageComponent),
    canActivate: [AuthRedirectGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/homePage/homePage.component').then(m => m.HomePageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'pacient/:id',
    loadComponent: () => import('./pages/pacientPage/pacientPage.component').then(m => m.PacientPageComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
