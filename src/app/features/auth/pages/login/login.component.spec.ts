import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppFacade } from '../../../../core/facades/app.facade';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let appFacade: jasmine.SpyObj<AppFacade>;
  let router: jasmine.SpyObj<Router>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const appFacadeSpy = jasmine.createSpyObj('AppFacade', [
      'login',
      'logout',
      'isAuthenticated',
      'showLoading',
      'closeLoading',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'onShowError',
      'onShowOk',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AppFacade, useValue: appFacadeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    appFacade = TestBed.inject(AppFacade) as jasmine.SpyObj<AppFacade>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    appFacade.isAuthenticated.and.returnValue(false);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate username field', () => {
    const username = component.loginForm.get('username');
    expect(username?.valid).toBeFalsy();

    username?.setValue('admin');
    expect(username?.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const password = component.loginForm.get('password');
    expect(password?.valid).toBeFalsy();

    password?.setValue('admin');
    expect(password?.valid).toBeTruthy();
  });

  it('should call appFacade.login on valid form submit', () => {
    appFacade.login.and.returnValue(
      of({
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
        expires_in: 3600,
        refresh_expires_in: 86400,
      }),
    );

    component.loginForm.setValue({
      username: 'admin',
      password: 'admin',
    });

    component.onSubmit();

    expect(appFacade.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin',
    });
  });

  it('should navigate to home on successful login', () => {
    appFacade.login.and.returnValue(
      of({
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
        expires_in: 3600,
        refresh_expires_in: 86400,
      }),
    );

    component.loginForm.setValue({
      username: 'admin',
      password: 'admin',
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed login', () => {
    const errorResponse = { error: { message: 'Invalid credentials' } };
    appFacade.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.setValue({
      username: 'admin',
      password: 'wrong',
    });

    component.onSubmit();

    expect(toastService.onShowError).toHaveBeenCalledWith(
      'Erro ao fazer login. Verifique suas credenciais.',
    );
  });
});
