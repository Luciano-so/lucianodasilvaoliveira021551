import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/home/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'pets',
    loadChildren: () =>
      import('./features/pets/pets.routes').then((m) => m.PETS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'tutores',
    loadChildren: () =>
      import('./features/tutores/tutores.routes').then((m) => m.TUTORES_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
