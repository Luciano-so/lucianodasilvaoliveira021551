import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { Pet, PetFilters, PetListResponse } from '../models/pet.model';
import { PetsService } from '../services/pets.service';

export interface PetsState {
  pets: Pet[];
  selectedPet: Pet | null;
  filters: PetFilters;
  pagination: {
    total: number;
    page: number;
    size: number;
    pageCount: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PetsFacade {
  private _state$ = new BehaviorSubject<PetsState>({
    pets: [],
    selectedPet: null,
    filters: {
      page: 0,
      size: 10,
    },
    pagination: {
      total: 0,
      page: 0,
      size: 10,
      pageCount: 0,
    },
  });

  public state$ = this._state$.asObservable();

  // Selectors
  public pets$ = new BehaviorSubject<Pet[]>([]);
  public selectedPet$ = new BehaviorSubject<Pet | null>(null);
  public error$ = new BehaviorSubject<string | null>(null);
  public pagination$ = new BehaviorSubject<{
    total: number;
    page: number;
    size: number;
    pageCount: number;
  }>({
    total: 0,
    page: 0,
    size: 10,
    pageCount: 0,
  });

  private petsService = inject(PetsService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  constructor() {}

  loadPets(filters?: PetFilters): void {
    const currentState = this._state$.value;
    const appliedFilters = { ...currentState.filters, ...filters };

    this.updateState({ filters: appliedFilters });
    this.loadingService.show();

    this.petsService
      .getPets(appliedFilters)
      .pipe(
        tap((response: PetListResponse) => {
          this.updateState({
            pets: response.content,
            pagination: {
              total: response.total,
              page: response.page,
              size: response.size,
              pageCount: response.pageCount,
            },
          });
          this.pets$.next(response.content);
          this.pagination$.next({
            total: response.total,
            page: response.page,
            size: response.size,
            pageCount: response.pageCount,
          });
        }),
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe({
        error: (error) => {
          const errorMessage = error?.message || 'Erro ao carregar pets';
          this.toastService.onShowError(
            'Erro ao carregar pets. Tente novamente.',
          );
          this.error$.next(errorMessage);
        },
      });
  }

  searchPets(nome: string): void {
    this.loadPets({ ...this._state$.value.filters, nome, page: 0 });
  }

  goToPage(page: number): void {
    this.loadPets({ ...this._state$.value.filters, page });
  }
  clearError(): void {
    this.error$.next(null);
  }

  private updateState(partialState: Partial<PetsState>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }
}
