import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../shared/components/loading/service/loading.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'close',
      'hide',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'onShowError',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
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

  it('should call authService.login on valid form submit', () => {
    authService.login.and.returnValue(
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

    expect(loadingService.show).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin',
    });
  });

  it('should navigate to home on successful login', () => {
    authService.login.and.returnValue(
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

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.close).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed login', () => {
    const errorResponse = { error: { message: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.setValue({
      username: 'admin',
      password: 'wrong',
    });

    component.onSubmit();

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
    expect(toastService.onShowError).toHaveBeenCalledWith(
      'Erro ao fazer login. Verifique suas credenciais.',
    );
  });
});
