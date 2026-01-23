import { Tutor } from '../../tutores/models/tutor.model';

export interface PetPhoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca?: string;
  idade: number;
  foto?: PetPhoto;
  tutores?: Tutor[];
}

export interface CreatePetDto {
  nome: string;
  raca: string;
  idade: number;
}

export interface UpdatePetDto {
  nome: string;
  raca: string;
  idade: number;
}

export interface PetListResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
}

export interface PetFilters {
  nome?: string;
  raca?: string;
  page?: number;
  size?: number;
}
