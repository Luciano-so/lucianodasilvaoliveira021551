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
        expect(mockLoadingService.show).toHaveBeenCalled();
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockToastService.onShowError).toHaveBeenCalledWith(
          'Erro ao carregar pets. Tente novamente.',
        );
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockLoadingService.show).toHaveBeenCalled();
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockToastService.onShowError).toHaveBeenCalledWith(
          'Erro ao remover pet. Tente novamente.',
        );
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockLoadingService.show).toHaveBeenCalled();
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockToastService.onShowError).toHaveBeenCalledWith(
          'Erro ao carregar pet. Tente novamente.',
        );
        expect(mockLoadingService.close).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should clear error', () => {
    facade.error$.next('Erro teste');
    facade.clearError();

    facade.error$.subscribe((error) => {
      expect(error).toBeNull();
    });
  });
});
