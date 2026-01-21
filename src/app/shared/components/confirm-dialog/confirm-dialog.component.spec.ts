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
    icon: 'warning'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogDataWithIcon },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título correto', () => {
    const title = fixture.nativeElement.querySelector('.confirm-dialog-title');
    expect(title.textContent).toContain(dialogDataWithIcon.title);
  });

  it('deve exibir a mensagem correta', () => {
    const message = fixture.nativeElement.querySelector('.confirm-dialog-content span');
    expect(message.textContent).toContain(dialogDataWithIcon.message);
  });

  it('deve exibir os textos dos botões de confirmação e cancelamento', () => {
    const cancelBtn = fixture.nativeElement.querySelector('.confirm-dialog-back-btn');
    const confirmBtn = fixture.nativeElement.querySelector('.confirm-dialog-confirm-btn');

    expect(cancelBtn.textContent).toContain(dialogDataWithIcon.cancelText);
    expect(confirmBtn.textContent).toContain(dialogDataWithIcon.confirmText);
  });

  it('deve chamar close(false) ao clicar no botão de cancelar', () => {
    const cancelBtn = fixture.debugElement.query(By.css('.confirm-dialog-back-btn'));
    cancelBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve chamar close(true) ao clicar no botão de confirmar', () => {
    const confirmBtn = fixture.debugElement.query(By.css('.confirm-dialog-confirm-btn'));
    confirmBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('deve fechar ao clicar no botão de fechar (ícone)', () => {
    const closeBtn = fixture.debugElement.query(By.css('.close-button'));
    closeBtn.triggerEventHandler('click', null);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('deve renderizar o ícone no botão de confirmação quando fornecido', () => {
    const icon = fixture.debugElement.query(By.css('.confirm-dialog-confirm-btn mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe(dialogDataWithIcon.icon);
  });
});

describe('ConfirmDialogComponent sem ícone', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const dialogDataWithoutIcon = {
    title: 'Confirmação',
    message: 'Mensagem de confirmação',
    confirmText: 'Sim',
    cancelText: 'Não',
    color: 'primary'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogDataWithoutIcon },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('não deve renderizar ícone se não for passado no data', () => {
    const icon = fixture.debugElement.query(By.css('.confirm-dialog-confirm-btn mat-icon'));
    expect(icon).toBeNull();
  });
});
