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
        expect(mockLoadingService.show).toHaveBeenCalled();
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockLoadingService.close).toHaveBeenCalled();
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
    expect(mockLoadingService.show).not.toHaveBeenCalled();
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
        expect(mockLoadingService.show).toHaveBeenCalled();
        expect(mockLoadingService.close).toHaveBeenCalled();
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
          'Erro ao remover tutor. Tente novamente.',
        );
        expect(mockLoadingService.close).toHaveBeenCalled();
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
        expect(mockLoadingService.show).toHaveBeenCalled();
        expect(mockLoadingService.close).toHaveBeenCalled();
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
