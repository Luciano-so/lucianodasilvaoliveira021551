import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PetFilters, PetListResponse } from '../models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly API_URL = `${environment.apiUrl}/v1/pets`;
  private http = inject(HttpClient);

  constructor() {}

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
}
