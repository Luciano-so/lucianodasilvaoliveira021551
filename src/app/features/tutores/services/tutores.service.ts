import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../../../core/services/http-base.service';
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
export class TutoresService extends HttpBaseService {
  private readonly API_URL = '/v1/tutores';

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

    return this.get<TutorListResponse>(this.API_URL, { params });
  }

  getTutorById(id: number): Observable<Tutor> {
    return this.get<Tutor>(`${this.API_URL}/${id}`);
  }

  createTutor(tutor: CreateTutorDto): Observable<Tutor> {
    return this.post<Tutor>(this.API_URL, tutor);
  }

  updateTutor(id: number, tutor: UpdateTutorDto): Observable<Tutor> {
    return this.put<Tutor>(`${this.API_URL}/${id}`, tutor);
  }

  deleteTutor(id: number): Observable<void> {
    return this.delete<void>(`${this.API_URL}/${id}`);
  }

  uploadPhoto(tutorId: number, photo: File): Observable<TutorPhoto> {
    const formData = new FormData();
    formData.append('foto', photo);
    return this.post<TutorPhoto>(`${this.API_URL}/${tutorId}/fotos`, formData);
  }

  deletePhoto(tutorId: number, photoId: number): Observable<void> {
    return this.delete<void>(`${this.API_URL}/${tutorId}/fotos/${photoId}`);
  }

  linkPet(tutorId: number, petId: number): Observable<void> {
    return this.post<void>(`${this.API_URL}/${tutorId}/pets/${petId}`, {});
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    return this.delete<void>(`${this.API_URL}/${tutorId}/pets/${petId}`);
  }
}
