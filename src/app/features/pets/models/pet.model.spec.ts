import {
  CreatePetDto,
  Pet,
  PetFilters,
  PetListResponse,
  PetPhoto,
  UpdatePetDto,
} from './pet.model';

describe('Pet Models', () => {
  it('should define Pet interface', () => {
    const pet: Pet = {
      id: 1,
      nome: 'Rex',
      raca: 'Labrador',
      idade: 3,
      foto: {
        id: 1,
        nome: 'foto.jpg',
        contentType: 'image/jpeg',
        url: 'http://example.com/foto.jpg',
      },
      tutores: [],
    };
    expect(pet.id).toBe(1);
    expect(pet.nome).toBe('Rex');
  });

  it('should define PetPhoto interface', () => {
    const photo: PetPhoto = {
      id: 1,
      nome: 'foto.jpg',
      contentType: 'image/jpeg',
      url: 'http://example.com/foto.jpg',
    };
    expect(photo.id).toBe(1);
    expect(photo.nome).toBe('foto.jpg');
  });

  it('should define CreatePetDto interface', () => {
    const dto: CreatePetDto = {
      nome: 'Rex',
      raca: 'Labrador',
      idade: 3,
    };
    expect(dto.nome).toBe('Rex');
    expect(dto.raca).toBe('Labrador');
    expect(dto.idade).toBe(3);
  });

  it('should define UpdatePetDto interface', () => {
    const dto: UpdatePetDto = {
      nome: 'Rex Updated',
      raca: 'Labrador',
      idade: 4,
    };
    expect(dto.nome).toBe('Rex Updated');
    expect(dto.idade).toBe(4);
  });

  it('should define PetListResponse interface', () => {
    const response: PetListResponse = {
      page: 0,
      size: 10,
      total: 1,
      pageCount: 1,
      content: [],
    };
    expect(response.page).toBe(0);
    expect(response.total).toBe(1);
  });

  it('should define PetFilters interface', () => {
    const filters: PetFilters = {
      nome: 'Rex',
      raca: 'Labrador',
      page: 0,
      size: 10,
    };
    expect(filters.nome).toBe('Rex');
    expect(filters.page).toBe(0);
  });
});
