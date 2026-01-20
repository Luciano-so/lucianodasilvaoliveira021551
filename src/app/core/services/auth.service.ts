import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { AuthResponse, LoginRequest, User } from '../models/auth.model';
import { ToastService } from './../../shared/components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage(),
  );
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken(),
  );

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private router = inject(Router);
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  constructor() {
    this.isAuthenticatedSubject.next(this.hasValidToken());
  }

  private hasValidToken(): boolean {
    return !!this.getToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/autenticacao/login`,
        credentials,
      )
      .pipe(
        tap((response) => {
          this.setTokens(response.access_token, response.refresh_token);
          const user: User = {
            username: credentials.username,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
          };
          this.setUser(user);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      this.toastService.onShowError('Sessão expirada. Faça login novamente.');
      throw new Error('No refresh token available');
    }

    this.loadingService.show();

    return this.http
      .put<AuthResponse>(
        `${environment.apiUrl}/autenticacao/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      )
      .pipe(
        tap((response) => {
          this.setTokens(response.access_token, response.refresh_token);
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            const updatedUser: User = {
              ...currentUser,
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
            };
            this.setUser(updatedUser);
            this.currentUserSubject.next(updatedUser);
          }
          this.isAuthenticatedSubject.next(true);
        }),
        finalize(() => this.loadingService.close()),
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
