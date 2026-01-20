import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('ToastService', () => {
  let service: ToastService;
  let snackBar: MatSnackBar;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
    snackBar = TestBed.inject(MatSnackBar);
    consoleErrorSpy = spyOn(console, 'error');
  });

  it('should show success snackbar with default message and accent panel class', () => {
    const openSpy = spyOn(snackBar, 'open');

    service.onShowOk();

    expect(openSpy).toHaveBeenCalledWith(
      'Procedimento realizado com sucesso!',
      'Ok',
      jasmine.objectContaining({
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['accentSnackBar'],
      })
    );
  });

  it('should show success snackbar with custom message', () => {
    const openSpy = spyOn(snackBar, 'open');
    const message = 'Sucesso customizado';

    service.onShowOk(message);

    expect(openSpy).toHaveBeenCalledWith(
      message,
      'Ok',
      jasmine.objectContaining({
        panelClass: ['accentSnackBar'],
      })
    );
  });

  it('should show error snackbar with default message and warn panel class', () => {
    const openSpy = spyOn(snackBar, 'open');

    service.onShowError();

    expect(openSpy).toHaveBeenCalledWith(
      'Ocorreu um erro ao efetuar o procedimento!',
      'Ok',
      jasmine.objectContaining({
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['warnSnackBar'],
      })
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should show error snackbar with custom message and log error', () => {
    const openSpy = spyOn(snackBar, 'open');
    const error = new Error('Teste de erro');
    const message = 'Erro customizado';

    service.onShowError(message, error);

    expect(openSpy).toHaveBeenCalledWith(
      message,
      'Ok',
      jasmine.objectContaining({
        panelClass: ['warnSnackBar'],
      })
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ', error);
  });
});
