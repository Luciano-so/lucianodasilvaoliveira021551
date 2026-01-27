import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { MenuService } from '../../shared/services/menu.service';
import { AuthService } from '../services/auth.service';

export interface AppState {
  isAuthenticated: boolean;
  currentUser: any | null;
  menuItems: any[];
  activeMenuItem: string;
  isLoading: boolean;
  isCollapsed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppFacade implements OnDestroy {
  private _appState$ = new BehaviorSubject<AppState>({
    isAuthenticated: false,
    currentUser: null,
    menuItems: [],
    activeMenuItem: '',
    isLoading: false,
    isCollapsed: false,
  });

  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);
  private menuService = inject(MenuService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.initializeState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeState(): void {
    combineLatest([
      this.authService.isAuthenticated$,
      this.authService.currentUser$,
      this.menuService.menuItems$,
      this.menuService.activeMenuItem$,
      this.loadingService.isLoading$,
      this.menuService.isCollapsed$,
    ])
      .pipe(
        map(
          ([
            isAuthenticated,
            currentUser,
            menuItems,
            activeMenuItem,
            isLoading,
            isCollapsed,
          ]) => ({
            isAuthenticated,
            currentUser,
            menuItems,
            activeMenuItem,
            isLoading,
            isCollapsed,
          }),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((state) => {
        this._appState$.next(state);
      });
  }

  get appState$(): Observable<AppState> {
    return this._appState$.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._appState$.pipe(map((state) => state.isAuthenticated));
  }

  get currentUser$(): Observable<any> {
    return this._appState$.pipe(map((state) => state.currentUser));
  }

  get menuItems$(): Observable<any[]> {
    return this._appState$.pipe(map((state) => state.menuItems));
  }

  get activeMenuItem$(): Observable<string> {
    return this._appState$.pipe(map((state) => state.activeMenuItem));
  }

  get isLoading$(): Observable<boolean> {
    return this._appState$.pipe(map((state) => state.isLoading));
  }

  get isCollapsed$(): Observable<boolean> {
    return this._appState$.pipe(map((state) => state.isCollapsed));
  }

  // === AUTHENTICATION ===
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.authService.login(credentials);
  }

  logout(): void {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // === LOADING ===
  showLoading(): void {
    this.loadingService.show();
  }

  closeLoading(): void {
    this.loadingService.close();
  }

  // === MENU ===
  setActiveMenuItem(item: string): void {
    this.menuService.setActiveMenuItem(item);
  }

  toggleMenu(): void {
    this.menuService.toggleMenu();
  }
}
