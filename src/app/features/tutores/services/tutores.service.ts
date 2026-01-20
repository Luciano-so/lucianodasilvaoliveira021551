import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateTutorDto,
  Tutor,
  TutorFilters,
  TutorListResponse,
  TutorPhoto,
  UpdateTutorDto,
} from '../models/tutor.model';

@Injectable({
  providedIn: 'root',
})
export class TutoresService {
  private readonly API_URL = `${environment.apiUrl}/v1/tutores`;
  private http = inject(HttpClient);

  getTutores(filters?: TutorFilters): Observable<TutorListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.nome) {
        params = params.set('nome', filters.nome);
      }
      if (filters.email) {
        params = params.set('email', filters.email);
      }
      if (filters.telefone) {
        params = params.set('telefone', filters.telefone);
      }
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.size) {
        params = params.set('size', filters.size.toString());
      }
    }

    return this.http.get<TutorListResponse>(this.API_URL, { params });
  }

  getTutorById(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.API_URL}/${id}`);
  }

  createTutor(tutor: CreateTutorDto): Observable<Tutor> {
    return this.http.post<Tutor>(this.API_URL, tutor);
  }

  updateTutor(id: number, tutor: UpdateTutorDto): Observable<Tutor> {
    return this.http.put<Tutor>(`${this.API_URL}/${id}`, tutor);
  }

  deleteTutor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  uploadPhoto(tutorId: number, photo: File): Observable<TutorPhoto> {
    const formData = new FormData();
    formData.append('foto', photo);
    return this.http.post<TutorPhoto>(
      `${this.API_URL}/${tutorId}/fotos`,
      formData,
    );
  }

  deletePhoto(tutorId: number, photoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${tutorId}/fotos/${photoId}`,
    );
  }

  linkPet(tutorId: number, petId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${tutorId}/pets/${petId}`, {});
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${tutorId}/pets/${petId}`);
  }
}
