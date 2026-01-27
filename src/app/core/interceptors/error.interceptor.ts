import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../shared/components/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return throwError(() => error);
      }

      let errorMessage = 'Ocorreu um erro. Tente novamente.';

      switch (error.status) {
        case 0:
          errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
          break;
        case 400:
          errorMessage =
            error.error?.message ||
            'Dados inválidos. Verifique as informações.';
          break;
        case 403:
          errorMessage = 'Acesso negado.';
          break;
        case 404:
          errorMessage = error.error?.message || 'Recurso não encontrado.';
          break;
        case 429:
          errorMessage = 'Muitas requisições. Aguarde um momento.';
          break;
        case 500:
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
          break;
        case 503:
          errorMessage = 'Serviço temporariamente indisponível.';
          break;
        default:
          errorMessage = error.error?.message || errorMessage;
      }

      toastService.onShowError(errorMessage);
      return throwError(() => error);
    }),
  );
};
