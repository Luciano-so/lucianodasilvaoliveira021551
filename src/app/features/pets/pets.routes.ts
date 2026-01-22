import { Routes } from '@angular/router';

export const PETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/pet-list/pet-list.component').then(
        (m) => m.PetListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/pet-form/pet-form.component').then(
        (m) => m.PetFormComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/pet-form/pet-form.component').then(
        (m) => m.PetFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/pet-detail/pet-detail.component').then(
        (m) => m.PetDetailComponent,
      ),
  },
];
