import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppFacade } from '../../../core/facades/app.facade';
import { MenuItem } from '../../models/shared.model';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockFacade: jasmine.SpyObj<AppFacade>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Pets', icon: 'pets', route: '/pets' },
    { label: 'Tutores', icon: 'people', route: '/tutores' },
  ];

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj(
      'AppFacade',
      ['setActiveMenuItem', 'toggleMenu'],
      {
        appState$: new BehaviorSubject({
          isAuthenticated: true,
          menuItems: mockMenuItems,
          activeMenuItem: '/dashboard',
          isCollapsed: false,
        }),
      },
    );

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: AppFacade, useValue: facadeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    mockFacade = TestBed.inject(AppFacade) as jasmine.SpyObj<AppFacade>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct state', () => {
    fixture.detectChanges();

    expect(component.isAuthenticated).toBe(true);
    expect(component.menuItems).toEqual(mockMenuItems);
    expect(component.activeMenuItem).toBe('/dashboard');
    expect(component.isCollapsed).toBe(false);
  });

  it('should navigate to correct route on menu item click', () => {
    fixture.detectChanges();

    component.onMenuItemClick('/pets');

    expect(mockFacade.setActiveMenuItem).toHaveBeenCalledWith('/pets');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pets']);
  });

  it('should toggle menu', () => {
    component.toggleMenu();

    expect(mockFacade.toggleMenu).toHaveBeenCalled();
  });

  it('should render menu items', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const menuItems = compiled.querySelectorAll('.menu__item');

    expect(menuItems.length).toBe(3);
  });

  it('should handle logout', () => {
    const facadeSpy = jasmine.createSpyObj(
      'AppFacade',
      ['setActiveMenuItem', 'toggleMenu', 'logout'],
      {
        appState$: new BehaviorSubject({
          isAuthenticated: true,
          menuItems: mockMenuItems,
          activeMenuItem: '/dashboard',
          isCollapsed: false,
        }),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: AppFacade, useValue: facadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(MenuComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.logout();

    expect(facadeSpy.logout).toHaveBeenCalled();
  });

  it('should handle unauthenticated state', () => {
    const facadeSpy = jasmine.createSpyObj(
      'AppFacade',
      ['setActiveMenuItem', 'toggleMenu'],
      {
        appState$: new BehaviorSubject({
          isAuthenticated: false,
          menuItems: [],
          activeMenuItem: '',
          isCollapsed: false,
        }),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: AppFacade, useValue: facadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(MenuComponent);
    const newComponent = newFixture.componentInstance;

    newFixture.detectChanges();

    expect(newComponent.isAuthenticated).toBe(false);
    expect(newComponent.menuItems).toEqual([]);
  });

  it('should handle menu state changes', () => {
    const facadeSpy = jasmine.createSpyObj(
      'AppFacade',
      ['setActiveMenuItem', 'toggleMenu'],
      {
        appState$: new BehaviorSubject({
          isAuthenticated: true,
          menuItems: mockMenuItems,
          activeMenuItem: '/pets',
          isCollapsed: true,
        }),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: AppFacade, useValue: facadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(MenuComponent);
    const newComponent = newFixture.componentInstance;

    newFixture.detectChanges();

    expect(newComponent.activeMenuItem).toBe('/pets');
    expect(newComponent.isCollapsed).toBe(true);
  });
});
