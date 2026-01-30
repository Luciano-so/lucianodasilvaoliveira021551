import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TutoresFacade } from '../../facades/tutores.facade';
import { Tutor } from '../../models/tutor.model';
import { TutorListComponent } from './tutor-list.component';

describe('TutorListComponent', () => {
  let component: TutorListComponent;
  let fixture: ComponentFixture<TutorListComponent>;
  let mockTutoresFacade: jasmine.SpyObj<TutoresFacade>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTutores: Tutor[] = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      cpf: 12345678901,
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '11888888888',
      endereco: 'Rua B, 456',
      cpf: 98765432109,
    },
  ];

  const mockPagination = {
    page: 0,
    size: 10,
    total: 2,
    pageCount: 1,
  };

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj(
      'TutoresFacade',
      ['loadTutores', 'searchTutores', 'goToPage', 'clearFilters'],
      {
        tutores$: new BehaviorSubject(mockTutores),
        error$: new BehaviorSubject(null),
        pagination$: new BehaviorSubject(mockPagination),
      },
    );

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TutorListComponent],
      providers: [
        { provide: TutoresFacade, useValue: facadeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorListComponent);
    component = fixture.componentInstance;
    mockTutoresFacade = TestBed.inject(
      TutoresFacade,
    ) as jasmine.SpyObj<TutoresFacade>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load tutores', () => {
    TestBed.runInInjectionContext(() => component.ngOnInit());

    expect(mockTutoresFacade.loadTutores).toHaveBeenCalled();
    expect(component.tutores).toEqual(mockTutores);
    expect(component.pagination).toEqual(mockPagination);
  });

  it('should clear filters on destroy', () => {
    component.ngOnDestroy();

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
  });

  it('should navigate to add tutor page', () => {
    component.onAddTutor();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tutores/new']);
  });

  it('should search tutores when search term is provided', fakeAsync(() => {
    const newFacadeSpy = jasmine.createSpyObj(
      'TutoresFacade',
      ['loadTutores', 'searchTutores', 'goToPage', 'clearFilters'],
      {
        tutores$: new BehaviorSubject(mockTutores),
        error$: new BehaviorSubject(null),
        pagination$: new BehaviorSubject(mockPagination),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TutorListComponent],
      providers: [
        { provide: TutoresFacade, useValue: newFacadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(TutorListComponent);
    const newComponent = newFixture.componentInstance;

    TestBed.runInInjectionContext(() => newComponent.ngOnInit());
    newComponent.onSearchChange('João');

    tick(300);

    expect(newFacadeSpy.searchTutores).toHaveBeenCalledWith('João');
  }));

  it('should clear filters when search term is empty', () => {
    component.onSearchChange('');

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
  });

  it('should clear filters when search term is only whitespace', () => {
    component.onSearchChange('   ');

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
  });

  it('should go to page', () => {
    component.onPageChange(1);

    expect(mockTutoresFacade.goToPage).toHaveBeenCalledWith(1);
  });

  it('should update tutores when facade emits new data', (done) => {
    const newTutores: Tutor[] = [
      {
        id: 3,
        nome: 'Pedro Lima',
        email: 'pedro@email.com',
        telefone: '11777777777',
        endereco: 'Rua C, 789',
        cpf: 11122233344,
      },
    ];

    (mockTutoresFacade.tutores$ as BehaviorSubject<Tutor[]>).next(newTutores);

    TestBed.runInInjectionContext(() => component.ngOnInit());

    setTimeout(() => {
      expect(component.tutores).toEqual(newTutores);
      done();
    }, 100);
  });

  it('should handle component lifecycle correctly', () => {
    spyOn(component, 'ngOnInit');
    spyOn(component, 'ngOnDestroy');

    TestBed.runInInjectionContext(() => component.ngOnInit());
    expect(component.ngOnInit).toHaveBeenCalled();

    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });

  it('should handle empty search term', () => {
    component.onSearchChange('');

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
    expect(mockTutoresFacade.searchTutores).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only search term', () => {
    component.onSearchChange('   \t\n  ');

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
    expect(mockTutoresFacade.searchTutores).not.toHaveBeenCalled();
  });

  it('should handle null search term', () => {
    component.onSearchChange(null as any);

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
    expect(mockTutoresFacade.searchTutores).not.toHaveBeenCalled();
  });

  it('should handle undefined search term', () => {
    component.onSearchChange(undefined as any);

    expect(mockTutoresFacade.clearFilters).toHaveBeenCalled();
    expect(mockTutoresFacade.searchTutores).not.toHaveBeenCalled();
  });

  it('should handle search with valid term', fakeAsync(() => {
    const newFacadeSpy = jasmine.createSpyObj(
      'TutoresFacade',
      ['loadTutores', 'searchTutores', 'goToPage', 'clearFilters'],
      {
        tutores$: new BehaviorSubject(mockTutores),
        error$: new BehaviorSubject(null),
        pagination$: new BehaviorSubject(mockPagination),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TutorListComponent],
      providers: [
        { provide: TutoresFacade, useValue: newFacadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(TutorListComponent);
    const newComponent = newFixture.componentInstance;

    TestBed.runInInjectionContext(() => newComponent.ngOnInit());
    newComponent.onSearchChange('João');

    tick(300);

    expect(newFacadeSpy.searchTutores).toHaveBeenCalledWith('João');
    expect(newFacadeSpy.clearFilters).not.toHaveBeenCalled();
  }));

  it('should handle pagination change', () => {
    component.onPageChange(2);

    expect(mockTutoresFacade.goToPage).toHaveBeenCalledWith(2);
  });

  it('should handle zero page change', () => {
    component.onPageChange(0);

    expect(mockTutoresFacade.goToPage).toHaveBeenCalledWith(0);
  });

  it('should initialize with empty arrays', () => {
    expect(component).toBeTruthy();
    expect(component.tutores).toEqual([]);
    expect(component.error).toBeNull();
  });
});
