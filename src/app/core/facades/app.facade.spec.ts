import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
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
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated$: new BehaviorSubject<boolean>(false),
      currentUser$: new BehaviorSubject<any>(null),
    });

    const menuSpy = jasmine.createSpyObj('MenuService', [], {
      menuItems$: new BehaviorSubject<any[]>([]),
      activeMenuItem$: new BehaviorSubject<string>(''),
    });

    const loadingSpy = jasmine.createSpyObj('LoadingService', [], {
      isLoading$: new BehaviorSubject<boolean>(false),
    });

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

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should expose computed observables', () => {
    expect(facade.isAuthenticated$).toBeDefined();
    expect(facade.currentUser$).toBeDefined();
    expect(facade.menuItems$).toBeDefined();
    expect(facade.activeMenuItem$).toBeDefined();
    expect(facade.isLoading$).toBeDefined();
    expect(facade.appState$).toBeDefined();
  });

  it('should combine state from all services', (done) => {
    // Set up test data
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

    facade.appState$.subscribe((state) => {
      expect(state.isAuthenticated).toBe(true);
      expect(state.currentUser?.username).toBe('admin');
      expect(state.menuItems.length).toBe(2);
      expect(state.activeMenuItem).toBe('dashboard');
      expect(state.isLoading).toBe(true);
      done();
    });
  });
});
