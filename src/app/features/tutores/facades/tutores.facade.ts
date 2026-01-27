import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { BaseFacade } from '../../../core/facades/base.facade';
import {
  CreateTutorDto,
  Tutor,
  TutorFilters,
  TutorPhoto,
  UpdateTutorDto,
} from '../models/tutor.model';
import { TutoresService } from '../services/tutores.service';

@Injectable({
  providedIn: 'root',
})
export class TutoresFacade extends BaseFacade<Tutor, TutorFilters> {
  private tutoresService = inject(TutoresService);

  constructor() {
    super();
    this.initializeState({ page: 0, size: 10 });
  }

  public get tutores$() {
    return this.items$;
  }

  public get selectedTutor$() {
    return this.selectedItem$;
  }

  protected getServiceLoadMethod() {
    return (filters: TutorFilters) => this.tutoresService.getTutores(filters);
  }

  loadTutores(filters?: TutorFilters): void {
    this.loadItems(this.getServiceLoadMethod(), filters, 'tutores');
  }

  searchTutores(nome: string): void {
    this.search(nome);
  }

  loadTutorById(id: number): void {
    this.loadItemById(
      (id) => this.tutoresService.getTutorById(id),
      id,
      'tutor',
    );
  }

  deleteTutor(id: number): void {
    this.deleteItem((id) => this.tutoresService.deleteTutor(id), id, 'Tutor');
  }

  uploadPhoto(tutorId: number, photo: File): Observable<TutorPhoto> {
    return this.tutoresService.uploadPhoto(tutorId, photo);
  }

  deletePhoto(tutorId: number, photoId: number): Observable<void> {
    return this.tutoresService.deletePhoto(tutorId, photoId);
  }

  createTutorWithPhoto(
    tutorData: CreateTutorDto,
    photo?: File | null,
  ): Observable<void> {
    return this.tutoresService.createTutor(tutorData).pipe(
      concatMap((savedTutor) => {
        if (photo) {
          return this.tutoresService
            .uploadPhoto(savedTutor.id, photo)
            .pipe(concatMap(() => of(undefined)));
        }
        return of(undefined);
      }),
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
    return this.tutoresService
      .updateTutor(tutorId, tutorData)
      .pipe(
        concatMap((savedTutor) =>
          this.handlePhotoOperation(savedTutor, photoOptions),
        ),
      );
  }

  linkPet(tutorId: number, petId: number): Observable<void> {
    return this.tutoresService.linkPet(tutorId, petId).pipe(
      tap(() => {
        this.toastService.onShowOk('Pet vinculado com sucesso!');
        this.loadTutorById(tutorId);
      }),
    );
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    return this.tutoresService.unlinkPet(tutorId, petId).pipe(
      tap(() => {
        this.toastService.onShowOk('Vínculo removido com sucesso!');
        this.loadTutorById(tutorId);
      }),
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
}
