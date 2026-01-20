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
    loadComponent: () =>
      import('./features/pets/pages/pet-list/pet-list.component').then(
        (m) => m.PetListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'pets/new',
    loadComponent: () =>
      import('./features/pets/pages/pet-form/pet-form.component').then(
        (m) => m.PetFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'pets/:id/edit',
    loadComponent: () =>
      import('./features/pets/pages/pet-form/pet-form.component').then(
        (m) => m.PetFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tutores',
    loadComponent: () =>
      import('./features/tutores/pages/tutor-list/tutor-list.component').then(
        (m) => m.TutorListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tutores/new',
    loadComponent: () =>
      import('./features/tutores/pages/tutor-form/tutor-form.component').then(
        (m) => m.TutorFormComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tutores/:id/edit',
    loadComponent: () =>
      import('./features/tutores/pages/tutor-form/tutor-form.component').then(
        (m) => m.TutorFormComponent,
      ),
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
