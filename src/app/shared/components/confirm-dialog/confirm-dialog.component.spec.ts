import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent com ícone', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const dialogDataWithIcon = {
    title: 'Confirmação',
    message: 'Mensagem de confirmação',
    confirmText: 'Sim',
    cancelText: 'Não',
    color: 'warn',
    icon: 'warning',
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogDataWithIcon },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título correto', () => {
    const title = fixture.nativeElement.querySelector('.confirm-dialog__title');
    expect(title.textContent).toContain(dialogDataWithIcon.title);
  });

  it('deve exibir a mensagem correta', () => {
    const message = fixture.nativeElement.querySelector(
      '.confirm-dialog__content span',
    );
    expect(message.textContent).toContain(dialogDataWithIcon.message);
  });

  it('deve exibir os textos dos botões de confirmação e cancelamento', () => {
    const cancelBtn = fixture.nativeElement.querySelector(
      '.confirm-dialog__back-btn',
    );
    const confirmBtn = fixture.nativeElement.querySelector(
      '.confirm-dialog__confirm-btn',
    );

    expect(cancelBtn.textContent).toContain(dialogDataWithIcon.cancelText);
    expect(confirmBtn.textContent).toContain(dialogDataWithIcon.confirmText);
  });

  it('deve chamar close(false) ao clicar no botão de cancelar', () => {
    const cancelBtn = fixture.debugElement.query(
      By.css('.confirm-dialog__back-btn'),
    );
    cancelBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve chamar close(true) ao clicar no botão de confirmar', () => {
    const confirmBtn = fixture.debugElement.query(
      By.css('.confirm-dialog__confirm-btn'),
    );
    confirmBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('deve fechar ao clicar no botão de fechar (ícone)', () => {
    const closeBtn = fixture.debugElement.query(
      By.css('.confirm-dialog__close-button'),
    );
    closeBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve renderizar HTML na mensagem quando fornecido', () => {
    const dialogDataWithHtml = {
      title: 'Confirmação',
      message: '<strong>Mensagem</strong> com <em>HTML</em>',
      confirmText: 'Sim',
      cancelText: 'Não',
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogDataWithHtml },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(ConfirmDialogComponent);
    newFixture.detectChanges();

    const message = newFixture.nativeElement.querySelector(
      '.confirm-dialog__content span',
    );
    expect(message.innerHTML).toContain('<strong>Mensagem</strong>');
    expect(message.innerHTML).toContain('<em>HTML</em>');
  });

  it('deve lidar com dados vazios', () => {
    const emptyDialogData = {
      title: '',
      message: '',
      confirmText: '',
      cancelText: '',
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: emptyDialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(ConfirmDialogComponent);
    newFixture.detectChanges();

    const title = newFixture.nativeElement.querySelector(
      '.confirm-dialog__title',
    );
    const message = newFixture.nativeElement.querySelector(
      '.confirm-dialog__content span',
    );

    expect(title.textContent.trim()).toBe('');
    expect(message.textContent.trim()).toBe('');
  });

  it('deve fechar com false quando close(false) é chamado', () => {
    component.close(false);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve fechar com true quando close(true) é chamado', () => {
    component.close(true);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
