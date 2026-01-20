import { Pet } from '../../pets/models/pet.model';

export interface TutorPhoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Tutor {
  id: number;
  nome: string;
  email: string | null;
  telefone: string;
  endereco: string;
  cpf: number | null;
  foto?: TutorPhoto | null;
  pets?: Pet[];
}

export interface CreateTutorDto {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
}

export interface UpdateTutorDto {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
}

export interface TutorListResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Tutor[];
}

export interface TutorFilters {
  nome?: string;
  email?: string;
  telefone?: string;
  page?: number;
  size?: number;
}
