import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { TutoresService } from '../../tutores/services/tutores.service';
import { PetsService } from '../services/pets.service';
import { PetsFacade } from './pets.facade';

describe('PetsFacade', () => {
  let facade: PetsFacade;
  let mockPetsService: jasmine.SpyObj<PetsService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockTutoresService: jasmine.SpyObj<TutoresService>;

  const mockPetListResponse = {
    content: [
      { id: 1, nome: 'Rex', raca: 'Labrador', idade: 3 },
      { id: 2, nome: 'Mia', raca: 'Persa', idade: 2 },
    ],
    total: 2,
    page: 0,
    size: 10,
    pageCount: 1,
  };

  beforeEach(() => {
    const petsServiceSpy = jasmine.createSpyObj('PetsService', [
      'getPets',
      'getPetById',
      'deletePet',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'onShowError',
      'onShowOk',
    ]);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'close',
    ]);
    const tutoresServiceSpy = jasmine.createSpyObj('TutoresService', [
      'getTutores',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PetsFacade,
        { provide: PetsService, useValue: petsServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: TutoresService, useValue: tutoresServiceSpy },
      ],
    });

    facade = TestBed.inject(PetsFacade);
    mockPetsService = TestBed.inject(
      PetsService,
    ) as jasmine.SpyObj<PetsService>;
    mockToastService = TestBed.inject(
      ToastService,
    ) as jasmine.SpyObj<ToastService>;
    mockLoadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
    mockTutoresService = TestBed.inject(
      TutoresService,
    ) as jasmine.SpyObj<TutoresService>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load pets successfully', (done) => {
    mockPetsService.getPets.and.returnValue(of(mockPetListResponse));

    facade.loadPets();

    setTimeout(() => {
      facade.pets$.subscribe((pets) => {
        expect(pets).toEqual(mockPetListResponse.content);

        done();
      });
    }, 0);
  });

  it('should handle load pets error', (done) => {
    const error = { message: 'Erro ao carregar pets' };
    mockPetsService.getPets.and.returnValue(throwError(error));

    facade.loadPets();

    setTimeout(() => {
      facade.error$.subscribe((error) => {
        expect(error).toBe('Erro ao carregar pets');
        done();
      });
    }, 0);
  });

  it('should search pets', () => {
    mockPetsService.getPets.and.returnValue(of(mockPetListResponse));

    facade.searchPets('Rex');

    expect(mockPetsService.getPets).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      nome: 'Rex',
    });
  });

  it('should go to page', () => {
    mockPetsService.getPets.and.returnValue(of(mockPetListResponse));

    facade.goToPage(1);

    expect(mockPetsService.getPets).toHaveBeenCalledWith({
      page: 1,
      size: 10,
    });
  });

  it('should clear filters without loading pets', () => {
    facade.clearFilters();

    expect(mockPetsService.getPets).not.toHaveBeenCalled();
    expect(mockLoadingService.show).not.toHaveBeenCalled();
  });

  it('should delete pet successfully', (done) => {
    mockPetsService.deletePet.and.returnValue(of(void 0));

    facade.deletePet(1);

    setTimeout(() => {
      facade.error$.subscribe((error) => {
        expect(error).toBeNull();
        expect(mockToastService.onShowOk).toHaveBeenCalledWith(
          'Pet removido com sucesso!',
        );

        done();
      });
    }, 0);
  });

  it('should handle delete pet error', (done) => {
    const error = { message: 'Erro ao remover pet' };
    mockPetsService.deletePet.and.returnValue(throwError(error));

    facade.deletePet(1);

    setTimeout(() => {
      facade.error$.subscribe((error) => {
        expect(error).toBe('Erro ao remover pet');
        done();
      });
    }, 0);
  });

  it('should load pets with custom filters', () => {
    const customFilters = { page: 1, size: 20, nome: 'Rex' };
    mockPetsService.getPets.and.returnValue(of(mockPetListResponse));

    facade.loadPets(customFilters);

    expect(mockPetsService.getPets).toHaveBeenCalledWith({
      page: 1,
      size: 20,
      nome: 'Rex',
    });
  });

  it('should merge filters correctly', () => {
    mockPetsService.getPets.and.returnValue(of(mockPetListResponse));

    facade.loadPets({ page: 0, size: 5 });
    expect(mockPetsService.getPets).toHaveBeenCalledWith({ page: 0, size: 5 });

    facade.loadPets({ nome: 'Rex' });

    expect(mockPetsService.getPets).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      nome: 'Rex',
    });
  });

  it('should load pet by id successfully', (done) => {
    const mockPet = { id: 1, nome: 'Rex', raca: 'Labrador', idade: 3 };
    mockPetsService.getPetById.and.returnValue(of(mockPet));

    facade.loadPetById(1);

    facade.selectedPet$.subscribe((pet) => {
      if (pet) {
        expect(pet).toEqual(mockPet);

        done();
      }
    });
  });

  it('should handle load pet by id error', (done) => {
    const error = { message: 'Pet não encontrado' };
    mockPetsService.getPetById.and.returnValue(throwError(error));

    facade.loadPetById(1);

    facade.error$.subscribe((error) => {
      if (error) {
        expect(error).toBe('Pet não encontrado');
        done();
      }
    });
  });

  it('should clear error', () => {
    (facade as any)._error$.next('Erro teste');
    facade.clearError();

    facade.error$.subscribe((error) => {
      expect(error).toBeNull();
    });
  });

  describe('photo and create/update operations', () => {
    let facade2: PetsFacade;
    let petsServiceSpy2: jasmine.SpyObj<PetsService>;
    let tutoresServiceSpy2: jasmine.SpyObj<TutoresService>;

    beforeEach(() => {
      petsServiceSpy2 = jasmine.createSpyObj('PetsService', [
        'createPet',
        'uploadPhoto',
        'deletePhoto',
        'updatePet',
      ]);
      tutoresServiceSpy2 = jasmine.createSpyObj('TutoresService', [
        'unlinkPet',
      ]);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          PetsFacade,
          { provide: PetsService, useValue: petsServiceSpy2 },
          { provide: TutoresService, useValue: tutoresServiceSpy2 },
        ],
      });

      facade2 = TestBed.inject(PetsFacade);
    });

    it('should upload and delete photo through facade', (done) => {
      const fakePhoto = new File([''], 'photo.png', { type: 'image/png' });
      const photoResp: any = { id: 5 };
      petsServiceSpy2.uploadPhoto.and.returnValue(of(photoResp));
      petsServiceSpy2.deletePhoto.and.returnValue(of(void 0));

      facade2.uploadPhoto(1, fakePhoto).subscribe((res) => {
        expect(res).toEqual(photoResp);
        expect(petsServiceSpy2.uploadPhoto).toHaveBeenCalledWith(1, fakePhoto);

        facade2.deletePhoto(1, 5).subscribe(() => {
          expect(petsServiceSpy2.deletePhoto).toHaveBeenCalledWith(1, 5);
          done();
        });
      });
    });

    it('should unlink tutor via tutores service', (done) => {
      tutoresServiceSpy2.unlinkPet.and.returnValue(of(void 0));

      facade2.unlinkTutor(2, 3).subscribe(() => {
        expect(tutoresServiceSpy2.unlinkPet).toHaveBeenCalledWith(2, 3);
        done();
      });
    });

    it('should create pet and upload photo when provided', (done) => {
      const savedPet = { id: 42 } as any;
      petsServiceSpy2.createPet.and.returnValue(of(savedPet));
      petsServiceSpy2.uploadPhoto.and.returnValue(of({ id: 9 } as any));

      const dto: any = { nome: 'Novo' };
      const file = new File([''], 'a.jpg');

      facade2.createPetWithPhoto(dto, file).subscribe(() => {
        expect(petsServiceSpy2.createPet).toHaveBeenCalledWith(dto);
        expect(petsServiceSpy2.uploadPhoto).toHaveBeenCalledWith(42, file);
        done();
      });
    });

    it('should handle update with new photo + currentPhotoId', (done) => {
      const savedPet = { id: 7 } as any;
      petsServiceSpy2.updatePet.and.returnValue(of(savedPet));
      petsServiceSpy2.deletePhoto.and.returnValue(of(void 0));
      petsServiceSpy2.uploadPhoto.and.returnValue(of({ id: 11 } as any));

      const options = {
        newPhoto: new File([''], 'b.jpg'),
        currentPhotoId: 2,
      } as any;

      facade2
        .updatePetWithPhoto(7, { nome: 'X' } as any, options)
        .subscribe(() => {
          expect(petsServiceSpy2.updatePet).toHaveBeenCalledWith(7, {
            nome: 'X',
          } as any);
          expect(petsServiceSpy2.deletePhoto).toHaveBeenCalledWith(7, 2);
          expect(petsServiceSpy2.uploadPhoto).toHaveBeenCalledWith(
            7,
            options.newPhoto,
          );
          done();
        });
    });

    it('should handle update with photoRemoved and currentPhotoId', (done) => {
      const savedPet = { id: 8 } as any;
      petsServiceSpy2.updatePet.and.returnValue(of(savedPet));
      petsServiceSpy2.deletePhoto.and.returnValue(of(void 0));

      const options = { photoRemoved: true, currentPhotoId: 3 } as any;

      facade2
        .updatePetWithPhoto(8, { nome: 'Y' } as any, options)
        .subscribe(() => {
          expect(petsServiceSpy2.deletePhoto).toHaveBeenCalledWith(8, 3);
          done();
        });
    });

    it('should handle update with only newPhoto', (done) => {
      const savedPet = { id: 9 } as any;
      petsServiceSpy2.updatePet.and.returnValue(of(savedPet));
      petsServiceSpy2.uploadPhoto.and.returnValue(of({ id: 12 } as any));

      const options = { newPhoto: new File([''], 'c.jpg') } as any;

      facade2
        .updatePetWithPhoto(9, { nome: 'Z' } as any, options)
        .subscribe(() => {
          expect(petsServiceSpy2.uploadPhoto).toHaveBeenCalledWith(
            9,
            options.newPhoto,
          );
          done();
        });
    });
  });
});
