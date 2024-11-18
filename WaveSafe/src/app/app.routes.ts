import { Routes } from '@angular/router';
import { authGuard } from './Guards/authGuard.guard';

export const routes: Routes = [
  {
    path:'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginPageComponent)
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
