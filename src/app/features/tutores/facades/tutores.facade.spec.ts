import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { TutorListResponse } from '../models/tutor.model';
import { TutoresService } from '../services/tutores.service';
import { TutoresFacade } from './tutores.facade';

describe('TutoresFacade', () => {
  let facade: TutoresFacade;
  let mockTutoresService: jasmine.SpyObj<TutoresService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockTutorListResponse: TutorListResponse = {
    content: [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        cpf: 12345678901,
      },
      {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '11888888888',
        endereco: 'Rua B, 456',
        cpf: 98765432109,
      },
    ],
    total: 2,
    page: 0,
    size: 10,
    pageCount: 1,
  };

  beforeEach(() => {
    const tutoresServiceSpy = jasmine.createSpyObj('TutoresService', [
      'getTutores',
      'getTutorById',
      'deleteTutor',
      'createTutor',
      'updateTutor',
      'uploadPhoto',
      'deletePhoto',
      'linkPet',
      'unlinkPet',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'onShowError',
      'onShowOk',
    ]);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'close',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TutoresFacade,
        { provide: TutoresService, useValue: tutoresServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });

    facade = TestBed.inject(TutoresFacade);
    mockTutoresService = TestBed.inject(
      TutoresService,
    ) as jasmine.SpyObj<TutoresService>;
    mockToastService = TestBed.inject(
      ToastService,
    ) as jasmine.SpyObj<ToastService>;
    mockLoadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load tutores successfully', (done) => {
    mockTutoresService.getTutores.and.returnValue(of(mockTutorListResponse));

    facade.loadTutores();

    setTimeout(() => {
      facade.tutores$.subscribe((tutores) => {
        expect(tutores).toEqual(mockTutorListResponse.content);
        done();
      });
    }, 0);
  });

  it('should handle load tutores error', (done) => {
    const error = { message: 'Erro ao carregar tutores' };
    mockTutoresService.getTutores.and.returnValue(throwError(error));

    facade.loadTutores();

    facade.error$.subscribe((error) => {
      if (error) {
        expect(error).toBe('Erro ao carregar tutores');
        expect(mockToastService.onShowError).toHaveBeenCalledWith(
          'Erro ao carregar tutores. Tente novamente.',
        );
        done();
      }
    });
  });

  it('should search tutores', () => {
    mockTutoresService.getTutores.and.returnValue(of(mockTutorListResponse));

    facade.searchTutores('João');

    expect(mockTutoresService.getTutores).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      nome: 'João',
    });
  });

  it('should go to page', () => {
    mockTutoresService.getTutores.and.returnValue(of(mockTutorListResponse));

    facade.goToPage(1);

    expect(mockTutoresService.getTutores).toHaveBeenCalledWith({
      page: 1,
      size: 10,
    });
  });

  it('should clear filters without loading tutores', () => {
    facade.clearFilters();

    expect(mockTutoresService.getTutores).not.toHaveBeenCalled();
  });

  it('should delete tutor successfully', (done) => {
    mockTutoresService.deleteTutor.and.returnValue(of(void 0));

    facade.deleteTutor(1);

    setTimeout(() => {
      facade.error$.subscribe((error) => {
        expect(error).toBeNull();
        expect(mockToastService.onShowOk).toHaveBeenCalledWith(
          'Tutor removido com sucesso!',
        );
        done();
      });
    }, 0);
  });

  it('should handle delete tutor error', (done) => {
    const error = { message: 'Erro ao remover tutor' };
    mockTutoresService.deleteTutor.and.returnValue(throwError(error));

    facade.deleteTutor(1);

    setTimeout(() => {
      facade.error$.subscribe((error) => {
        expect(error).toBe('Erro ao remover tutor');
        expect(mockToastService.onShowError).toHaveBeenCalledWith(
          'Erro ao remover Tutor. Tente novamente.',
        );
        done();
      });
    }, 0);
  });

  it('should load tutores with custom filters', () => {
    const customFilters = { page: 1, size: 20, nome: 'João' };
    mockTutoresService.getTutores.and.returnValue(of(mockTutorListResponse));

    facade.loadTutores(customFilters);

    expect(mockTutoresService.getTutores).toHaveBeenCalledWith({
      page: 1,
      size: 20,
      nome: 'João',
    });
  });

  it('should merge filters correctly', () => {
    mockTutoresService.getTutores.and.returnValue(of(mockTutorListResponse));

    facade.loadTutores({ page: 0, size: 5 });
    expect(mockTutoresService.getTutores).toHaveBeenCalledWith({
      page: 0,
      size: 5,
    });

    facade.loadTutores({ nome: 'João' });

    expect(mockTutoresService.getTutores).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      nome: 'João',
    });
  });

  it('should load tutor by id successfully', (done) => {
    const mockTutor = {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: 12345678901,
    };
    mockTutoresService.getTutorById.and.returnValue(of(mockTutor));

    facade.loadTutorById(1);

    facade.selectedTutor$.subscribe((tutor) => {
      if (tutor) {
        expect(tutor).toEqual(mockTutor);
        done();
      }
    });
  });

  it('should handle load tutor by id error', (done) => {
    const error = { message: 'Tutor não encontrado' };
    mockTutoresService.getTutorById.and.returnValue(throwError(error));

    facade.loadTutorById(1);

    facade.error$.subscribe((error) => {
      if (error) {
        expect(error).toBe('Tutor não encontrado');
        expect(mockToastService.onShowError).toHaveBeenCalledWith(
          'Erro ao carregar tutor. Tente novamente.',
        );
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

  describe('createTutorWithPhoto', () => {
    const mockTutorData = {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: '12345678901',
    };

    const mockSavedTutor = {
      id: 1,
      ...mockTutorData,
      cpf: 12345678901,
    };

    it('should create tutor without photo', (done) => {
      mockTutoresService.createTutor.and.returnValue(of(mockSavedTutor));

      facade.createTutorWithPhoto(mockTutorData).subscribe({
        next: () => {
          expect(mockTutoresService.createTutor).toHaveBeenCalledWith(
            mockTutorData,
          );
          expect(mockTutoresService.uploadPhoto).not.toHaveBeenCalled();
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });

    it('should create tutor with photo', (done) => {
      const mockPhoto = new File([''], 'photo.jpg');
      mockTutoresService.createTutor.and.returnValue(of(mockSavedTutor));
      mockTutoresService.uploadPhoto.and.returnValue(
        of({
          id: 1,
          nome: 'photo.jpg',
          contentType: 'image/jpeg',
          url: 'photo.jpg',
        }),
      );

      facade.createTutorWithPhoto(mockTutorData, mockPhoto).subscribe({
        next: () => {
          expect(mockTutoresService.createTutor).toHaveBeenCalledWith(
            mockTutorData,
          );
          expect(mockTutoresService.uploadPhoto).toHaveBeenCalledWith(
            1,
            mockPhoto,
          );
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });

    it('should handle create tutor error', (done) => {
      const error = { message: 'Erro ao criar tutor' };
      mockTutoresService.createTutor.and.returnValue(throwError(error));

      facade.createTutorWithPhoto(mockTutorData).subscribe({
        error: (err) => {
          done();
        },
      });
    });
  });

  describe('updateTutorWithPhoto', () => {
    const mockTutorData = {
      nome: 'João Silva Atualizado',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: '12345678901',
    };

    const mockUpdatedTutor = {
      id: 1,
      ...mockTutorData,
      cpf: 12345678901,
    };

    it('should update tutor without photo changes', (done) => {
      mockTutoresService.updateTutor.and.returnValue(of(mockUpdatedTutor));

      facade.updateTutorWithPhoto(1, mockTutorData, {}).subscribe({
        next: () => {
          expect(mockTutoresService.updateTutor).toHaveBeenCalledWith(
            1,
            mockTutorData,
          );
          expect(mockTutoresService.uploadPhoto).not.toHaveBeenCalled();
          expect(mockTutoresService.deletePhoto).not.toHaveBeenCalled();
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });

    it('should update tutor with new photo', (done) => {
      const mockPhoto = new File([''], 'new-photo.jpg');
      mockTutoresService.updateTutor.and.returnValue(of(mockUpdatedTutor));
      mockTutoresService.uploadPhoto.and.returnValue(
        of({
          id: 2,
          nome: 'new-photo.jpg',
          contentType: 'image/jpeg',
          url: 'new-photo.jpg',
        }),
      );

      facade
        .updateTutorWithPhoto(1, mockTutorData, { newPhoto: mockPhoto })
        .subscribe({
          next: () => {
            expect(mockTutoresService.updateTutor).toHaveBeenCalledWith(
              1,
              mockTutorData,
            );
            expect(mockTutoresService.uploadPhoto).toHaveBeenCalledWith(
              1,
              mockPhoto,
            );
          },
          complete: () => {
            setTimeout(() => {
              done();
            }, 0);
          },
        });
    });

    it('should update tutor replacing existing photo', (done) => {
      const mockPhoto = new File([''], 'new-photo.jpg');
      mockTutoresService.updateTutor.and.returnValue(of(mockUpdatedTutor));
      mockTutoresService.deletePhoto.and.returnValue(of(void 0));
      mockTutoresService.uploadPhoto.and.returnValue(
        of({
          id: 2,
          nome: 'new-photo.jpg',
          contentType: 'image/jpeg',
          url: 'new-photo.jpg',
        }),
      );

      facade
        .updateTutorWithPhoto(1, mockTutorData, {
          newPhoto: mockPhoto,
          currentPhotoId: 1,
        })
        .subscribe({
          next: () => {
            expect(mockTutoresService.deletePhoto).toHaveBeenCalledWith(1, 1);
            expect(mockTutoresService.uploadPhoto).toHaveBeenCalledWith(
              1,
              mockPhoto,
            );
          },
          complete: () => {
            setTimeout(() => {
              done();
            }, 0);
          },
        });
    });

    it('should update tutor removing photo', (done) => {
      mockTutoresService.updateTutor.and.returnValue(of(mockUpdatedTutor));
      mockTutoresService.deletePhoto.and.returnValue(of(void 0));

      facade
        .updateTutorWithPhoto(1, mockTutorData, {
          photoRemoved: true,
          currentPhotoId: 1,
        })
        .subscribe({
          next: () => {
            expect(mockTutoresService.deletePhoto).toHaveBeenCalledWith(1, 1);
            expect(mockTutoresService.uploadPhoto).not.toHaveBeenCalled();
          },
          complete: () => {
            setTimeout(() => {
              done();
            }, 0);
          },
        });
    });
  });

  describe('linkPet', () => {
    it('should link pet successfully', (done) => {
      mockTutoresService.linkPet.and.returnValue(of(void 0));
      mockTutoresService.getTutorById.and.returnValue(
        of(mockTutorListResponse.content[0]),
      );

      facade.linkPet(1, 10).subscribe({
        next: () => {
          expect(mockTutoresService.linkPet).toHaveBeenCalledWith(1, 10);
          expect(mockToastService.onShowOk).toHaveBeenCalledWith(
            'Pet vinculado com sucesso!',
          );
          expect(mockTutoresService.getTutorById).toHaveBeenCalledWith(1);
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });

    it('should handle link pet error', (done) => {
      const error = { message: 'Erro ao vincular pet' };
      mockTutoresService.linkPet.and.returnValue(throwError(error));

      facade.linkPet(1, 10).subscribe({
        error: (err) => {
          done();
        },
      });
    });
  });

  describe('unlinkPet', () => {
    it('should unlink pet successfully', (done) => {
      mockTutoresService.unlinkPet.and.returnValue(of(void 0));
      mockTutoresService.getTutorById.and.returnValue(
        of(mockTutorListResponse.content[0]),
      );

      facade.unlinkPet(1, 10).subscribe({
        next: () => {
          expect(mockTutoresService.unlinkPet).toHaveBeenCalledWith(1, 10);
          expect(mockToastService.onShowOk).toHaveBeenCalledWith(
            'Vínculo removido com sucesso!',
          );
          expect(mockTutoresService.getTutorById).toHaveBeenCalledWith(1);
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });

    it('should handle unlink pet error', (done) => {
      const error = { message: 'Erro ao remover vínculo' };
      mockTutoresService.unlinkPet.and.returnValue(throwError(error));

      facade.unlinkPet(1, 10).subscribe({
        error: (err) => {
          done();
        },
      });
    });
  });

  describe('uploadPhoto', () => {
    it('should upload photo successfully', (done) => {
      const mockPhoto = new File([''], 'photo.jpg');
      const mockPhotoResponse = {
        id: 1,
        nome: 'photo.jpg',
        contentType: 'image/jpeg',
        url: 'photo.jpg',
      };
      mockTutoresService.uploadPhoto.and.returnValue(of(mockPhotoResponse));

      facade.uploadPhoto(1, mockPhoto).subscribe({
        next: (result) => {
          expect(result).toEqual(mockPhotoResponse);
          expect(mockTutoresService.uploadPhoto).toHaveBeenCalledWith(
            1,
            mockPhoto,
          );
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });
  });

  describe('deletePhoto', () => {
    it('should delete photo successfully', (done) => {
      mockTutoresService.deletePhoto.and.returnValue(of(void 0));

      facade.deletePhoto(1, 10).subscribe({
        next: () => {
          expect(mockTutoresService.deletePhoto).toHaveBeenCalledWith(1, 10);
        },
        complete: () => {
          setTimeout(() => {
            done();
          }, 0);
        },
      });
    });
  });
});
