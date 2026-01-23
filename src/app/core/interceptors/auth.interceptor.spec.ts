import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getToken',
      'getRefreshToken',
      'refreshToken',
      'logout',
    ]);
    const httpSpy = jasmine.createSpyObj('HttpClient', ['request']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HttpClient, useValue: httpSpy },
      ],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should add authorization header when token exists and not auth route', (done) => {
    const token = 'test-token';
    const req = new HttpRequest('GET', '/api/test');
    const next = jasmine.createSpy('next').and.returnValue(of({}));

    authServiceSpy.getToken.and.returnValue(token);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        expect(authServiceSpy.getToken).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
          jasmine.objectContaining({
            headers: jasmine.objectContaining({
              get: jasmine.any(Function),
            }),
          }),
        );
        const calledRequest = next.calls.argsFor(0)[0];
        expect(calledRequest.headers.get('Authorization')).toBe(
          `Bearer ${token}`,
        );
        done();
      });
    });
  });

  it('should not add authorization header for auth routes', (done) => {
    const token = 'test-token';
    const req = new HttpRequest('POST', '/autenticacao/login', {});
    const next = jasmine.createSpy('next').and.returnValue(of({}));

    authServiceSpy.getToken.and.returnValue(token);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        expect(authServiceSpy.getToken).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(req);
        done();
      });
    });
  });

  it('should not add authorization header when no token exists', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const next = jasmine.createSpy('next').and.returnValue(of({}));

    authServiceSpy.getToken.and.returnValue(null);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        expect(authServiceSpy.getToken).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(req);
        done();
      });
    });
  });

  it('should handle 401 error with valid refresh token', (done) => {
    const token = 'test-token';
    const refreshToken = 'refresh-token';
    const newToken = 'new-token';
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      status: 401,
      url: '/api/test',
    });

    authServiceSpy.getToken.and.returnValue(token);
    authServiceSpy.getRefreshToken.and.returnValue(refreshToken);
    authServiceSpy.refreshToken.and.returnValue(
      of({
        access_token: newToken,
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
        refresh_expires_in: 86400,
      }),
    );

    const next = jasmine.createSpy('next').and.returnValues(
      throwError(() => errorResponse),
      of({}),
    );

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => {
        expect(authServiceSpy.getRefreshToken).toHaveBeenCalled();
        expect(authServiceSpy.refreshToken).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(2);
        expect(next.calls.argsFor(1)[0].headers.get('Authorization')).toBe(
          `Bearer ${newToken}`,
        );
        done();
      });
    });
  });

  it('should logout on 401 error when refresh token fails', (done) => {
    const token = 'test-token';
    const refreshToken = 'refresh-token';
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      status: 401,
      url: '/api/test',
    });
    const refreshError = new HttpErrorResponse({ status: 400 });

    authServiceSpy.getToken.and.returnValue(token);
    authServiceSpy.getRefreshToken.and.returnValue(refreshToken);
    authServiceSpy.refreshToken.and.returnValue(throwError(() => refreshError));

    const next = jasmine
      .createSpy('next')
      .and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(authServiceSpy.logout).toHaveBeenCalled();
          expect(error).toBe(refreshError);
          done();
        },
      });
    });
  });

  it('should logout on 401 error when no refresh token exists', (done) => {
    const token = 'test-token';
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      status: 401,
      url: '/api/test',
    });

    authServiceSpy.getToken.and.returnValue(token);
    authServiceSpy.getRefreshToken.and.returnValue(null);

    const next = jasmine
      .createSpy('next')
      .and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(authServiceSpy.getRefreshToken).toHaveBeenCalled();
          expect(authServiceSpy.logout).toHaveBeenCalled();
          expect(authServiceSpy.refreshToken).not.toHaveBeenCalled();
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });

  it('should not handle 401 error for auth routes', (done) => {
    const req = new HttpRequest('POST', '/autenticacao/login', {});
    const errorResponse = new HttpErrorResponse({
      status: 401,
      url: '/autenticacao/login',
    });

    const next = jasmine
      .createSpy('next')
      .and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(authServiceSpy.getRefreshToken).not.toHaveBeenCalled();
          expect(authServiceSpy.logout).not.toHaveBeenCalled();
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });

  it('should pass through non-401 errors', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      status: 500,
      url: '/api/test',
    });

    const next = jasmine
      .createSpy('next')
      .and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });
});
