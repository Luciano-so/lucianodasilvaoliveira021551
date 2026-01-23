import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import {
  CreatePetDto,
  Pet,
  PetFilters,
  PetListResponse,
  PetPhoto,
  UpdatePetDto,
} from '../models/pet.model';
import { PetsService } from './pets.service';

describe('PetsService', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;

  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
    foto: {
      id: 1,
      nome: 'foto-rex.jpg',
      contentType: 'image/jpeg',
      url: 'https://example.com/foto-rex.jpg',
    },
    tutores: [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        cpf: 12345678901,
      },
    ],
  };

  const mockPetListResponse: PetListResponse = {
    content: [mockPet],
    total: 1,
    page: 0,
    size: 10,
    pageCount: 1,
  };

  const mockPetPhoto: PetPhoto = {
    id: 1,
    nome: 'foto-rex.jpg',
    contentType: 'image/jpeg',
    url: 'https://example.com/foto-rex.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetsService],
    });
    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPets', () => {
    it('should return pet list without filters', () => {
      service.getPets().subscribe((response) => {
        expect(response).toEqual(mockPetListResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPetListResponse);
    });

    it('should return pet list with filters', () => {
      const filters: PetFilters = {
        nome: 'Rex',
        raca: 'Labrador',
        page: 0,
        size: 10,
      };

      service.getPets(filters).subscribe((response) => {
        expect(response).toEqual(mockPetListResponse);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiUrl}/v1/pets` &&
          request.params.get('nome') === 'Rex' &&
          request.params.get('raca') === 'Labrador' &&
          request.params.get('page') === '0' &&
          request.params.get('size') === '10'
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockPetListResponse);
    });
  });

  describe('getPetById', () => {
    it('should return a pet by id', () => {
      service.getPetById(1).subscribe((pet) => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPet);
    });
  });

  describe('createPet', () => {
    it('should create a pet', () => {
      const createPetDto: CreatePetDto = {
        nome: 'Rex',
        raca: 'Labrador',
        idade: 3,
      };

      service.createPet(createPetDto).subscribe((pet) => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createPetDto);
      req.flush(mockPet);
    });
  });

  describe('updatePet', () => {
    it('should update a pet', () => {
      const updatePetDto: UpdatePetDto = {
        nome: 'Rex Updated',
        raca: 'Labrador',
        idade: 4,
      };

      service.updatePet(1, updatePetDto).subscribe((pet) => {
        expect(pet).toEqual(mockPet);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatePetDto);
      req.flush(mockPet);
    });
  });

  describe('deletePet', () => {
    it('should delete a pet', () => {
      service.deletePet(1).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a photo', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      service.uploadPhoto(1, mockFile).subscribe((photo) => {
        expect(photo).toEqual(mockPetPhoto);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets/1/fotos`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockPetPhoto);
    });
  });

  describe('deletePhoto', () => {
    it('should delete a photo', () => {
      service.deletePhoto(1, 1).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/pets/1/fotos/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
