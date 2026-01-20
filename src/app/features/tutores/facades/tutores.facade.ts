import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import {
  CreateTutorDto,
  Tutor,
  TutorFilters,
  TutorListResponse,
  TutorPhoto,
  UpdateTutorDto,
} from '../models/tutor.model';
import { TutoresService } from '../services/tutores.service';

export interface TutoresState {
  tutores: Tutor[];
  selectedTutor: Tutor | null;
  filters: TutorFilters;
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
export class TutoresFacade {
  private _state$ = new BehaviorSubject<TutoresState>({
    tutores: [],
    selectedTutor: null,
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
  public tutores$ = new BehaviorSubject<Tutor[]>([]);
  public selectedTutor$ = new BehaviorSubject<Tutor | null>(null);
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

  private tutoresService = inject(TutoresService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  loadTutores(filters?: TutorFilters): void {
    this.loadingService.show();
    const currentState = this._state$.value;
    const appliedFilters = { ...currentState.filters, ...filters };

    this.updateState({ filters: appliedFilters });
    this.tutores$.next([]);
    this.error$.next(null);

    this.tutoresService
      .getTutores(appliedFilters)
      .pipe(
        tap((response: TutorListResponse) => {
          this.updateState({
            tutores: response.content,
            pagination: {
              total: response.total,
              page: response.page,
              size: response.size,
              pageCount: response.pageCount,
            },
          });
          this.tutores$.next(response.content);
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
          const errorMessage = error?.message || 'Erro ao carregar tutores';
          this.toastService.onShowError(
            'Erro ao carregar tutores. Tente novamente.',
          );
          this.error$.next(errorMessage);
        },
      });
  }

  searchTutores(nome: string): void {
    this.loadTutores({ ...this._state$.value.filters, nome, page: 0 });
  }

  goToPage(page: number): void {
    this.loadTutores({ ...this._state$.value.filters, page });
  }

  loadTutorById(id: number): void {
    this.selectedTutor$.next(null);
    this.updateState({ selectedTutor: null });

    this.loadingService.show();

    this.tutoresService
      .getTutorById(id)
      .pipe(
        tap((tutor: Tutor) => {
          this.updateState({ selectedTutor: tutor });
          this.selectedTutor$.next(tutor);
        }),
        finalize(() => {
          this.loadingService.close();
        }),
      )
      .subscribe({
        error: (error) => {
          const errorMessage = error?.message || 'Erro ao carregar tutor';
          this.toastService.onShowError(
            'Erro ao carregar tutor. Tente novamente.',
          );
          this.error$.next(errorMessage);
        },
      });
  }

  deleteTutor(id: number): void {
    this.loadingService.show();

    this.tutoresService
      .deleteTutor(id)
      .pipe(
        tap(() => {
          this.toastService.onShowOk('Tutor removido com sucesso!');
          this.loadTutores(this._state$.value.filters);
        }),
        finalize(() => {
          this.loadingService.close();
        }),
      )
      .subscribe({
        error: (error) => {
          const errorMessage = error?.message || 'Erro ao remover tutor';
          this.toastService.onShowError(
            'Erro ao remover tutor. Tente novamente.',
          );
          this.error$.next(errorMessage);
        },
      });
  }

  uploadPhoto(tutorId: number, photo: File): Observable<TutorPhoto> {
    this.loadingService.show();
    return this.tutoresService
      .uploadPhoto(tutorId, photo)
      .pipe(finalize(() => this.loadingService.close()));
  }

  deletePhoto(tutorId: number, photoId: number): Observable<void> {
    this.loadingService.show();
    return this.tutoresService
      .deletePhoto(tutorId, photoId)
      .pipe(finalize(() => this.loadingService.close()));
  }

  createTutorWithPhoto(
    tutorData: CreateTutorDto,
    photo?: File | null,
  ): Observable<void> {
    this.loadingService.show();
    return this.tutoresService.createTutor(tutorData).pipe(
      concatMap((savedTutor) => {
        if (photo) {
          return this.tutoresService
            .uploadPhoto(savedTutor.id, photo)
            .pipe(concatMap(() => of(undefined)));
        }
        return of(undefined);
      }),
      finalize(() => this.loadingService.close()),
    );
  }

  updateTutorWithPhoto(
    tutorId: number,
    tutorData: UpdateTutorDto,
    photoOptions: {
      newPhoto?: File | null;
      currentPhotoId?: number | null;
      photoRemoved?: boolean;
    },
  ): Observable<void> {
    this.loadingService.show();

    return this.tutoresService.updateTutor(tutorId, tutorData).pipe(
      concatMap((savedTutor) =>
        this.handlePhotoOperation(savedTutor, photoOptions),
      ),
      finalize(() => this.loadingService.close()),
    );
  }

  private handlePhotoOperation(
    tutor: Tutor,
    options: {
      newPhoto?: File | null;
      currentPhotoId?: number | null;
      photoRemoved?: boolean;
    },
  ): Observable<void> {
    const { newPhoto, currentPhotoId, photoRemoved } = options;

    if (newPhoto && currentPhotoId) {
      return this.tutoresService.deletePhoto(tutor.id, currentPhotoId).pipe(
        concatMap(() => this.tutoresService.uploadPhoto(tutor.id, newPhoto)),
        concatMap(() => of(undefined)),
      );
    }
    if (newPhoto) {
      return this.tutoresService
        .uploadPhoto(tutor.id, newPhoto)
        .pipe(concatMap(() => of(undefined)));
    }
    if (photoRemoved && currentPhotoId) {
      return this.tutoresService
        .deletePhoto(tutor.id, currentPhotoId)
        .pipe(concatMap(() => of(undefined)));
    }
    return of(undefined);
  }

  clearError(): void {
    this.error$.next(null);
  }

  private updateState(partialState: Partial<TutoresState>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }
}
