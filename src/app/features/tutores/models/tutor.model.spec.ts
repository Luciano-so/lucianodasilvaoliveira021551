import {
    CreateTutorDto,
    Tutor,
    TutorFilters,
    TutorListResponse,
    TutorPhoto,
    UpdateTutorDto,
} from './tutor.model';

describe('Tutor Models', () => {
  it('should define Tutor interface', () => {
    const tutor: Tutor = {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: 12345678901,
      foto: {
        id: 1,
        nome: 'foto.jpg',
        contentType: 'image/jpeg',
        url: 'http://example.com/foto.jpg',
      },
      pets: [],
    };
    expect(tutor.id).toBe(1);
    expect(tutor.nome).toBe('João Silva');
  });

  it('should define TutorPhoto interface', () => {
    const photo: TutorPhoto = {
      id: 1,
      nome: 'foto.jpg',
      contentType: 'image/jpeg',
      url: 'http://example.com/foto.jpg',
    };
    expect(photo.id).toBe(1);
    expect(photo.nome).toBe('foto.jpg');
  });

  it('should define CreateTutorDto interface', () => {
    const dto: CreateTutorDto = {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: '12345678901',
    };
    expect(dto.nome).toBe('João Silva');
    expect(dto.email).toBe('joao@email.com');
  });

  it('should define UpdateTutorDto interface', () => {
    const dto: UpdateTutorDto = {
      nome: 'João Silva Updated',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: '12345678901',
    };
    expect(dto.nome).toBe('João Silva Updated');
  });

  it('should define TutorListResponse interface', () => {
    const response: TutorListResponse = {
      page: 0,
      size: 10,
      total: 1,
      pageCount: 1,
      content: [],
    };
    expect(response.page).toBe(0);
    expect(response.total).toBe(1);
  });

  it('should define TutorFilters interface', () => {
    const filters: TutorFilters = {
      nome: 'João',
      email: 'joao@email.com',
      telefone: '11999999999',
      page: 0,
      size: 10,
    };
    expect(filters.nome).toBe('João');
    expect(filters.page).toBe(0);
  });
});
