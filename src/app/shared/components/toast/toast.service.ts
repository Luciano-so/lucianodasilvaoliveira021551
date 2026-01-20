import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private matSnackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  public onShowOk(message = 'Procedimento realizado com sucesso!'): void {
    this.show(message, {
      ...this.defaultConfig,
      panelClass: ['accentSnackBar'],
    });
  }

  public onShowError(
    message = 'Ocorreu um erro ao efetuar o procedimento!',
    error?: any,
  ): void {
    this.show(
      message,
      {
        ...this.defaultConfig,
        panelClass: ['warnSnackBar'],
      },
      error,
    );
  }

  private show(message: string, options: MatSnackBarConfig, error?: any) {
    this.matSnackBar.open(message, 'Ok', options);
    if (error) {
      console.error('Error: ', error);
    }
  }
}
