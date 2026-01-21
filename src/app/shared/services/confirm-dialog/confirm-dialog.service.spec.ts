import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService,
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });
    service = TestBed.inject(ConfirmDialogService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve abrir o dialog com valores padrão', () => {
    const afterClosedSpy = jasmine.createSpyObj('afterClosed', ['subscribe']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => afterClosedSpy,
    } as any);

    service.openConfirm({ message: 'Teste mensagem' }).subscribe();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          title: 'Confirmação',
          message: 'Teste mensagem',
        }),
        disableClose: true,
      }),
    );

    expect(afterClosedSpy.subscribe).toHaveBeenCalled();
  });

  it('deve abrir o dialog com valores customizados', () => {
    const options = {
      title: 'Título customizado',
      message: 'Mensagem customizada',
    };
    const afterClosed$ = of(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);

    let resultValue: any;
    service.openConfirm(options).subscribe((result) => (resultValue = result));

    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          title: options.title,
          message: options.message,
        }),
        disableClose: true,
      }),
    );

    expect(resultValue).toBeTrue();
  });
});
