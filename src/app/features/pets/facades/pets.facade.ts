import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import {
  CreatePetDto,
  Pet,
  PetFilters,
  PetListResponse,
  PetPhoto,
  UpdatePetDto,
} from '../models/pet.model';
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
          this.loadingService.close();
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

  loadPetById(id: number): void {
    this.loadingService.show();

    this.petsService
      .getPetById(id)
      .pipe(
        tap((pet: Pet) => {
          this.updateState({ selectedPet: pet });
          this.selectedPet$.next(pet);
        }),
        finalize(() => {
          this.loadingService.close();
        }),
      )
      .subscribe({
        error: (error) => {
          const errorMessage = error?.message || 'Erro ao carregar pet';
          this.toastService.onShowError(
            'Erro ao carregar pet. Tente novamente.',
          );
          this.error$.next(errorMessage);
        },
      });
  }

  createPet(pet: CreatePetDto): Observable<Pet> {
    this.loadingService.show();

    return this.petsService.createPet(pet).pipe(
      tap((newPet: Pet) => {
        this.toastService.onShowOk('Pet cadastrado com sucesso!');
        this.loadPets(this._state$.value.filters);
      }),
      finalize(() => {
        this.loadingService.close();
      }),
    );
  }

  updatePet(id: number, pet: UpdatePetDto): Observable<Pet> {
    this.loadingService.show();

    return this.petsService.updatePet(id, pet).pipe(
      tap((updatedPet: Pet) => {
        this.toastService.onShowOk('Pet atualizado com sucesso!');
        this.loadPets(this._state$.value.filters);
      }),
      finalize(() => {
        this.loadingService.close();
      }),
    );
  }

  deletePet(id: number): void {
    this.loadingService.show();

    this.petsService
      .deletePet(id)
      .pipe(
        tap(() => {
          this.toastService.onShowOk('Pet removido com sucesso!');
          this.loadPets(this._state$.value.filters);
        }),
        finalize(() => {
          this.loadingService.close();
        }),
      )
      .subscribe({
        error: (error) => {
          const errorMessage = error?.message || 'Erro ao remover pet';
          this.toastService.onShowError(
            'Erro ao remover pet. Tente novamente.',
          );
          this.error$.next(errorMessage);
        },
      });
  }

  uploadPhoto(petId: number, photo: File): Observable<PetPhoto> {
    this.loadingService.show();

    return this.petsService.uploadPhoto(petId, photo).pipe(
      tap(() => {
        this.toastService.onShowOk('Foto enviada com sucesso!');
        this.loadPetById(petId);
      }),
      finalize(() => {
        this.loadingService.close();
      }),
    );
  }

  clearError(): void {
    this.error$.next(null);
  }

  private updateState(partialState: Partial<PetsState>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }
}
