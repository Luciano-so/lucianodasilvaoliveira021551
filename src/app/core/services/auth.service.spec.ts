import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../shared/components/toast/toast.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { AuthResponse, LoginRequest, User } from '../models/auth.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockUser: User = {
    username: 'testuser',
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const mockAuthResponse: AuthResponse = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    expires_in: 3600,
    refresh_expires_in: 86400,
  };

  const mockLoginRequest: LoginRequest = {
    username: 'testuser',
    password: 'password',
  };

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const loadingMock = jasmine.createSpyObj('LoadingService', [
      'show',
      'close',
    ]);
    const toastMock = jasmine.createSpyObj('ToastService', ['onShowError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
        { provide: LoadingService, useValue: loadingMock },
        { provide: ToastService, useValue: toastMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
    toastServiceSpy = TestBed.inject(
      ToastService,
    ) as jasmine.SpyObj<ToastService>;

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and update state', (done) => {
      service.login(mockLoginRequest).subscribe((response) => {
        expect(response).toEqual(mockAuthResponse);
        expect(service.getCurrentUser()?.username).toBe('testuser');
        expect(service.isAuthenticated()).toBe(true);
        done();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/autenticacao/login`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockAuthResponse);
    });

    it('should handle login error', (done) => {
      const errorMessage = 'Invalid credentials';

      service.login(mockLoginRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/autenticacao/login`,
      );
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('refreshToken', () => {
    beforeEach(() => {
      localStorage.setItem('auth_refresh_token', 'refresh-token');
    });

    it('should refresh token successfully', (done) => {
      service.refreshToken().subscribe({
        next: (response) => {
          expect(response).toEqual(mockAuthResponse);

          setTimeout(() => {
            done();
          }, 0);
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/autenticacao/refresh`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer refresh-token',
      );
      req.flush(mockAuthResponse);
    });

    it('should logout when no refresh token exists', (done) => {
      localStorage.removeItem('auth_refresh_token');

      try {
        service.refreshToken().subscribe({
          next: () => fail('Should have thrown error'),
          error: (error) => {
            expect(error.message).toBe('No refresh token available');
            expect(toastServiceSpy.onShowError).toHaveBeenCalledWith(
              'Sessão expirada. Faça login novamente.',
            );
            done();
          },
        });
      } catch (error) {
        expect((error as Error).message).toBe('No refresh token available');
        expect(toastServiceSpy.onShowError).toHaveBeenCalledWith(
          'Sessão expirada. Faça login novamente.',
        );
        done();
      }
    });

    it('should handle refresh token error', (done) => {
      service.refreshToken().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/autenticacao/refresh`,
      );
      req.flush('Refresh failed', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'access-token');
      localStorage.setItem('auth_refresh_token', 'refresh-token');
    });

    it('should clear all stored data and navigate to login', () => {
      service.logout();

      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_refresh_token')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('token management', () => {
    it('should get and set tokens correctly', () => {
      service['setTokens']('access-token', 'refresh-token');

      expect(service.getToken()).toBe('access-token');
      expect(service.getRefreshToken()).toBe('refresh-token');
    });

    it('should return null when tokens do not exist', () => {
      expect(service.getToken()).toBeNull();
      expect(service.getRefreshToken()).toBeNull();
    });
  });

  describe('authentication state', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'valid-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('user management', () => {
    it('should get current user', () => {
      (service as any).currentUserSubject.next(mockUser);
      expect(service.getCurrentUser()?.username).toBe('testuser');
    });

    it('should return null when no user is set', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should load user from storage', () => {
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      const loadedUser = (service as any).getUserFromStorage();

      expect(loadedUser?.username).toBe('testuser');
      expect(loadedUser?.accessToken).toBe('access-token');
      expect(loadedUser?.refreshToken).toBe('refresh-token');
    });
  });

  describe('observables', () => {
    it('should expose currentUser$ observable', (done) => {
      service.currentUser$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it('should expose isAuthenticated$ observable', (done) => {
      service.isAuthenticated$.subscribe((isAuth) => {
        expect(isAuth).toBe(false);
        done();
      });
    });

    it('should update observables on login', (done) => {
      let userEmitted = false;
      let authEmitted = false;

      service.currentUser$.subscribe((user) => {
        if (user?.username === 'testuser') {
          userEmitted = true;
          expect(user.username).toBe('testuser');
          if (userEmitted && authEmitted) done();
        }
      });

      service.isAuthenticated$.subscribe((isAuth) => {
        if (isAuth === true) {
          authEmitted = true;
          expect(isAuth).toBe(true);
          if (userEmitted && authEmitted) done();
        }
      });

      service.login(mockLoginRequest).subscribe();
      const req = httpMock.expectOne(
        `${environment.apiUrl}/autenticacao/login`,
      );
      req.flush(mockAuthResponse);
    });
  });
});
