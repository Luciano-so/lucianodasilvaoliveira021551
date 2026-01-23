import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import {
  CreateTutorDto,
  Tutor,
  TutorFilters,
  TutorListResponse,
  TutorPhoto,
  UpdateTutorDto,
} from '../models/tutor.model';
import { TutoresService } from './tutores.service';

describe('TutoresService', () => {
  let service: TutoresService;
  let httpMock: HttpTestingController;

  const mockTutor: Tutor = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    endereco: 'Rua A, 123',
    cpf: 12345678901,
    foto: {
      id: 1,
      nome: 'foto-joao.jpg',
      contentType: 'image/jpeg',
      url: 'https://example.com/foto-joao.jpg',
    },
    pets: [],
  };

  const mockTutorListResponse: TutorListResponse = {
    content: [mockTutor],
    total: 1,
    page: 0,
    size: 10,
    pageCount: 1,
  };

  const mockTutorPhoto: TutorPhoto = {
    id: 1,
    nome: 'foto-joao.jpg',
    contentType: 'image/jpeg',
    url: 'https://example.com/foto-joao.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TutoresService],
    });
    service = TestBed.inject(TutoresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTutores', () => {
    it('should return tutor list without filters', () => {
      service.getTutores().subscribe((response) => {
        expect(response).toEqual(mockTutorListResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/tutores`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTutorListResponse);
    });

    it('should return tutor list with filters', () => {
      const filters: TutorFilters = {
        nome: 'João',
        email: 'joao@email.com',
        telefone: '11999999999',
        page: 0,
        size: 10,
      };

      service.getTutores(filters).subscribe((response) => {
        expect(response).toEqual(mockTutorListResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiUrl}/v1/tutores` &&
          request.params.get('nome') === 'João' &&
          request.params.get('email') === 'joao@email.com' &&
          request.params.get('telefone') === '11999999999' &&
          request.params.get('page') === '0' &&
          request.params.get('size') === '10'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockTutorListResponse);
    });
  });

  describe('getTutorById', () => {
    it('should return a tutor by id', () => {
      service.getTutorById(1).subscribe((tutor) => {
        expect(tutor).toEqual(mockTutor);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/tutores/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTutor);
    });
  });

  describe('createTutor', () => {
    it('should create a tutor', () => {
      const createTutorDto: CreateTutorDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        cpf: '12345678901',
      };

      service.createTutor(createTutorDto).subscribe((tutor) => {
        expect(tutor).toEqual(mockTutor);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/tutores`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createTutorDto);
      req.flush(mockTutor);
    });
  });

  describe('updateTutor', () => {
    it('should update a tutor', () => {
      const updateTutorDto: UpdateTutorDto = {
        nome: 'João Silva Updated',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        cpf: '12345678901',
      };

      service.updateTutor(1, updateTutorDto).subscribe((tutor) => {
        expect(tutor).toEqual(mockTutor);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/tutores/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateTutorDto);
      req.flush(mockTutor);
    });
  });

  describe('deleteTutor', () => {
    it('should delete a tutor', () => {
      service.deleteTutor(1).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/tutores/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a photo', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      service.uploadPhoto(1, mockFile).subscribe((photo) => {
        expect(photo).toEqual(mockTutorPhoto);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/v1/tutores/1/fotos`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockTutorPhoto);
    });
  });

  describe('deletePhoto', () => {
    it('should delete a photo', () => {
      service.deletePhoto(1, 1).subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/v1/tutores/1/fotos/1`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('linkPet', () => {
    it('should link a pet to a tutor', () => {
      service.linkPet(1, 1).subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/v1/tutores/1/pets/1`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  describe('unlinkPet', () => {
    it('should unlink a pet from a tutor', () => {
      service.unlinkPet(1, 1).subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/v1/tutores/1/pets/1`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
