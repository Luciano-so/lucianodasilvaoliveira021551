import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { BaseFacade } from '../../../core/facades/base.facade';
import { TutoresService } from '../../tutores/services/tutores.service';
import {
  CreatePetDto,
  Pet,
  PetFilters,
  PetPhoto,
  UpdatePetDto,
} from '../models/pet.model';
import { PetsService } from '../services/pets.service';

@Injectable({
  providedIn: 'root',
})
export class PetsFacade extends BaseFacade<Pet, PetFilters> {
  private petsService = inject(PetsService);
  private tutoresService = inject(TutoresService);

  constructor() {
    super();
    this.initializeState({ page: 0, size: 10 });
  }

  public get pets$() {
    return this.items$;
  }

  public get selectedPet$() {
    return this.selectedItem$;
  }

  protected getServiceLoadMethod() {
    return (filters: PetFilters) => this.petsService.getPets(filters);
  }

  loadPets(filters?: PetFilters): void {
    this.loadItems(this.getServiceLoadMethod(), filters, 'pets');
  }

  loadAllPets(): Observable<Pet[]> {
    return this.petsService
      .getPets({ size: 1000 })
      .pipe(concatMap((response) => of(response.content)));
  }

  searchPets(nome: string): void {
    this.search(nome);
  }

  loadPetById(id: number): void {
    this.loadItemById((id) => this.petsService.getPetById(id), id, 'pet');
  }

  deletePet(id: number): void {
    this.deleteItem((id) => this.petsService.deletePet(id), id, 'Pet');
  }

  uploadPhoto(petId: number, photo: File): Observable<PetPhoto> {
    return this.petsService.uploadPhoto(petId, photo);
  }

  deletePhoto(petId: number, photoId: number): Observable<void> {
    return this.petsService.deletePhoto(petId, photoId);
  }

  unlinkTutor(tutorId: number, petId: number): Observable<void> {
    return this.tutoresService.unlinkPet(tutorId, petId);
  }

  createPetWithPhoto(
    petData: CreatePetDto,
    photo?: File | null,
  ): Observable<void> {
    return this.petsService.createPet(petData).pipe(
      concatMap((savedPet) => {
        if (photo) {
          return this.petsService
            .uploadPhoto(savedPet.id, photo)
            .pipe(concatMap(() => of(undefined)));
        }
        return of(undefined);
      }),
    );
  }

  updatePetWithPhoto(
    petId: number,
    petData: UpdatePetDto,
    photoOptions: {
      newPhoto?: File | null;
      currentPhotoId?: number | null;
      photoRemoved?: boolean;
    },
  ): Observable<void> {
    return this.petsService
      .updatePet(petId, petData)
      .pipe(
        concatMap((savedPet) =>
          this.handlePhotoOperation(savedPet, photoOptions),
        ),
      );
  }

  private handlePhotoOperation(
    pet: Pet,
    options: {
      newPhoto?: File | null;
      currentPhotoId?: number | null;
      photoRemoved?: boolean;
    },
  ): Observable<void> {
    const { newPhoto, currentPhotoId, photoRemoved } = options;

    if (newPhoto && currentPhotoId) {
      return this.petsService.deletePhoto(pet.id, currentPhotoId).pipe(
        concatMap(() => this.petsService.uploadPhoto(pet.id, newPhoto)),
        concatMap(() => of(undefined)),
      );
    }
    if (newPhoto) {
      return this.petsService
        .uploadPhoto(pet.id, newPhoto)
        .pipe(concatMap(() => of(undefined)));
    }
    if (photoRemoved && currentPhotoId) {
      return this.petsService
        .deletePhoto(pet.id, currentPhotoId)
        .pipe(concatMap(() => of(undefined)));
    }
    return of(undefined);
  }
}
