import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
}

@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  protected get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    return this.http.get<T>(`${this.baseUrl}${normalizedEndpoint}`, options);
  }

  protected post<T>(
    endpoint: string,
    body: any,
    options?: HttpOptions,
  ): Observable<T> {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    return this.http.post<T>(
      `${this.baseUrl}${normalizedEndpoint}`,
      body,
      options,
    );
  }

  protected put<T>(
    endpoint: string,
    body: any,
    options?: HttpOptions,
  ): Observable<T> {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    return this.http.put<T>(
      `${this.baseUrl}${normalizedEndpoint}`,
      body,
      options,
    );
  }

  protected delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    return this.http.delete<T>(`${this.baseUrl}${normalizedEndpoint}`, options);
  }
}
