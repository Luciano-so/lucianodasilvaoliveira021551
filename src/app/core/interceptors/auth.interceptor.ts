import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const isAuthRoute = (url: string): boolean =>
  url.includes('/autenticacao/login') || url.includes('/autenticacao/refresh');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && !isAuthRoute(req.url)) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRoute(req.url)) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((response) => {
              const cloned = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${response.access_token}`,
                ),
              });
              return next(cloned);
            }),
            catchError((err) => {
              authService.logout();
              return throwError(() => err);
            }),
          );
        } else {
          authService.logout();
        }
      }

      return throwError(() => error);
    }),
  );
};
