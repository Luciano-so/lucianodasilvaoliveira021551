import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { MenuService } from '../../shared/services/menu.service';
import { AuthService } from '../services/auth.service';
import { AppFacade } from './app.facade';

describe('AppFacade', () => {
  let facade: AppFacade;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let menuServiceSpy: jasmine.SpyObj<MenuService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj(
      'AuthService',
      ['login', 'logout', 'isAuthenticated'],
      {
        isAuthenticated$: new BehaviorSubject<boolean>(false),
        currentUser$: new BehaviorSubject<any>(null),
      },
    );

    const menuSpy = jasmine.createSpyObj(
      'MenuService',
      ['setActiveMenuItem', 'toggleMenu'],
      {
        menuItems$: new BehaviorSubject<any[]>([]),
        activeMenuItem$: new BehaviorSubject<string>(''),
        isCollapsed$: new BehaviorSubject<boolean>(false),
      },
    );

    const loadingSpy = jasmine.createSpyObj(
      'LoadingService',
      ['show', 'close'],
      {
        isLoading$: new BehaviorSubject<boolean>(false),
      },
    );

    TestBed.configureTestingModule({
      providers: [
        AppFacade,
        { provide: AuthService, useValue: authSpy },
        { provide: MenuService, useValue: menuSpy },
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    facade = TestBed.inject(AppFacade);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    menuServiceSpy = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  it('should have correct initial state', (done) => {
    facade.appState$.subscribe((state) => {
      expect(state.isAuthenticated).toBe(false);
      expect(state.currentUser).toBe(null);
      expect(state.menuItems).toEqual([]);
      expect(state.activeMenuItem).toBe('');
      expect(state.isLoading).toBe(false);
      expect(state.isCollapsed).toBe(false);
      done();
    });
  });

  it('should emit correct values from individual observables', (done) => {
    (authServiceSpy.isAuthenticated$ as BehaviorSubject<boolean>).next(true);
    (authServiceSpy.currentUser$ as BehaviorSubject<any>).next({
      username: 'test',
    });
    (menuServiceSpy.menuItems$ as BehaviorSubject<any[]>).next([
      { label: 'Test' },
    ]);
    (menuServiceSpy.activeMenuItem$ as BehaviorSubject<string>).next('test');
    (loadingServiceSpy.isLoading$ as BehaviorSubject<boolean>).next(true);
    (menuServiceSpy.isCollapsed$ as BehaviorSubject<boolean>).next(true);

    let completed = 0;
    const total = 6;

    facade.isAuthenticated$.subscribe((value) => {
      expect(value).toBe(true);
      completed++;
      if (completed === total) done();
    });

    facade.currentUser$.subscribe((value) => {
      expect(value).toEqual({ username: 'test' });
      completed++;
      if (completed === total) done();
    });

    facade.menuItems$.subscribe((value) => {
      expect(value).toEqual([{ label: 'Test' }]);
      completed++;
      if (completed === total) done();
    });

    facade.activeMenuItem$.subscribe((value) => {
      expect(value).toBe('test');
      completed++;
      if (completed === total) done();
    });

    facade.isLoading$.subscribe((value) => {
      expect(value).toBe(true);
      completed++;
      if (completed === total) done();
    });

    facade.isCollapsed$.subscribe((value) => {
      expect(value).toBe(true);
      completed++;
      if (completed === total) done();
    });
  });

  it('should combine state from all services', (done) => {
    (authServiceSpy.isAuthenticated$ as BehaviorSubject<boolean>).next(true);
    (authServiceSpy.currentUser$ as BehaviorSubject<any>).next({
      username: 'admin',
    });
    (menuServiceSpy.menuItems$ as BehaviorSubject<any[]>).next([
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Pets', route: '/pets' },
    ]);
    (menuServiceSpy.activeMenuItem$ as BehaviorSubject<string>).next(
      'dashboard',
    );
    (loadingServiceSpy.isLoading$ as BehaviorSubject<boolean>).next(true);
    (menuServiceSpy.isCollapsed$ as BehaviorSubject<boolean>).next(false);

    facade.appState$.subscribe((state) => {
      expect(state.isAuthenticated).toBe(true);
      expect(state.currentUser?.username).toBe('admin');
      expect(state.menuItems.length).toBe(2);
      expect(state.activeMenuItem).toBe('dashboard');
      expect(state.isLoading).toBe(true);
      expect(state.isCollapsed).toBe(false);
      done();
    });
  });

  it('should call authService.login and return the observable', (done) => {
    const credentials = { username: 'admin', password: 'password' };
    const mockResponse = {
      access_token: 'fake-access-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      refresh_expires_in: 86400,
    };
    const expectedObservable = of(mockResponse);
    authServiceSpy.login.and.returnValue(expectedObservable);

    const result = facade.login(credentials);

    expect(authServiceSpy.login).toHaveBeenCalledWith(credentials);
    result.subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });
  });

  it('should call authService.logout', () => {
    facade.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should call authService.isAuthenticated and return false', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = facade.isAuthenticated();

    expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should call loadingService.show', () => {
    facade.showLoading();
  });

  it('should call loadingService.close', () => {
    facade.closeLoading();
  });

  it('should call menuService.setActiveMenuItem', () => {
    const menuItem = 'dashboard';
    facade.setActiveMenuItem(menuItem);

    expect(menuServiceSpy.setActiveMenuItem).toHaveBeenCalledWith(menuItem);
  });

  it('should call menuService.toggleMenu', () => {
    facade.toggleMenu();

    expect(menuServiceSpy.toggleMenu).toHaveBeenCalled();
  });
});
