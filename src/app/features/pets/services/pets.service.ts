import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreatePetDto,
  Pet,
  PetFilters,
  PetListResponse,
  PetPhoto,
  UpdatePetDto,
} from '../models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly API_URL = `${environment.apiUrl}/v1/pets`;
  private http = inject(HttpClient);

  getPets(filters?: PetFilters): Observable<PetListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.nome) {
        params = params.set('nome', filters.nome);
      }
      if (filters.raca) {
        params = params.set('raca', filters.raca);
      }
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.size) {
        params = params.set('size', filters.size.toString());
      }
    }

    return this.http.get<PetListResponse>(this.API_URL, { params });
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.API_URL}/${id}`);
  }

  createPet(pet: CreatePetDto): Observable<Pet> {
    return this.http.post<Pet>(this.API_URL, pet);
  }

  updatePet(id: number, pet: UpdatePetDto): Observable<Pet> {
    return this.http.put<Pet>(`${this.API_URL}/${id}`, pet);
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  uploadPhoto(petId: number, photo: File): Observable<PetPhoto> {
    const formData = new FormData();
    formData.append('foto', photo);
    return this.http.post<PetPhoto>(`${this.API_URL}/${petId}/fotos`, formData);
  }
}
