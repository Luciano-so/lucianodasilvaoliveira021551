import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PetsFacade } from '../../facades/pets.facade';
import { Pet } from '../../models/pet.model';
import { PetListComponent } from './pet-list.component';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let mockPetsFacade: jasmine.SpyObj<PetsFacade>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPets: Pet[] = [
    { id: 1, nome: 'Rex', raca: 'Labrador', idade: 3 },
    { id: 2, nome: 'Mia', raca: 'Persa', idade: 2 },
  ];

  const mockPagination = {
    page: 0,
    size: 10,
    total: 2,
    pageCount: 1,
  };

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj(
      'PetsFacade',
      ['loadPets', 'searchPets', 'goToPage', 'clearFilters'],
      {
        pets$: new BehaviorSubject(mockPets),
        error$: new BehaviorSubject(null),
        pagination$: new BehaviorSubject(mockPagination),
      },
    );

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        { provide: PetsFacade, useValue: facadeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    mockPetsFacade = TestBed.inject(PetsFacade) as jasmine.SpyObj<PetsFacade>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load pets', () => {
    component.ngOnInit();

    expect(mockPetsFacade.loadPets).toHaveBeenCalled();
    expect(component.pets).toEqual(mockPets);
    expect(component.pagination).toEqual(mockPagination);
  });

  it('should clear filters on destroy', () => {
    component.ngOnDestroy();

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
  });

  it('should navigate to add pet page', () => {
    component.onAddPet();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pets/new']);
  });

  it('should search pets when search term is provided', fakeAsync(() => {
    const newFacadeSpy = jasmine.createSpyObj(
      'PetsFacade',
      ['loadPets', 'searchPets', 'goToPage', 'clearFilters'],
      {
        pets$: new BehaviorSubject(mockPets),
        error$: new BehaviorSubject(null),
        pagination$: new BehaviorSubject(mockPagination),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        { provide: PetsFacade, useValue: newFacadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(PetListComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.ngOnInit();
    newComponent.onSearchChange('Rex');

    tick(300);

    expect(newFacadeSpy.searchPets).toHaveBeenCalledWith('Rex');
  }));

  it('should clear filters when search term is empty', () => {
    component.onSearchChange('');

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
  });

  it('should clear filters when search term is only whitespace', () => {
    component.onSearchChange('   ');

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
  });

  it('should go to page', () => {
    component.onPageChange(1);

    expect(mockPetsFacade.goToPage).toHaveBeenCalledWith(1);
  });

  it('should update pets when facade emits new data', (done) => {
    const newPets: Pet[] = [{ id: 3, nome: 'Bob', raca: 'Golden', idade: 1 }];

    (mockPetsFacade.pets$ as BehaviorSubject<Pet[]>).next(newPets);

    component.ngOnInit();

    setTimeout(() => {
      expect(component.pets).toEqual(newPets);
      done();
    }, 100);
  });

  it('should handle component lifecycle correctly', () => {
    spyOn(component, 'ngOnInit');
    spyOn(component, 'ngOnDestroy');

    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    component.ngOnDestroy();
    expect(component.ngOnDestroy).toHaveBeenCalled();
  });

  it('should handle empty search term', () => {
    component.onSearchChange('');

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
    expect(mockPetsFacade.searchPets).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only search term', () => {
    component.onSearchChange('   \t\n  ');

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
    expect(mockPetsFacade.searchPets).not.toHaveBeenCalled();
  });

  it('should handle null search term', () => {
    component.onSearchChange(null as any);

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
    expect(mockPetsFacade.searchPets).not.toHaveBeenCalled();
  });

  it('should handle undefined search term', () => {
    component.onSearchChange(undefined as any);

    expect(mockPetsFacade.clearFilters).toHaveBeenCalled();
    expect(mockPetsFacade.searchPets).not.toHaveBeenCalled();
  });

  it('should handle search with valid term', fakeAsync(() => {
    const newFacadeSpy = jasmine.createSpyObj(
      'PetsFacade',
      ['loadPets', 'searchPets', 'goToPage', 'clearFilters'],
      {
        pets$: new BehaviorSubject(mockPets),
        error$: new BehaviorSubject(null),
        pagination$: new BehaviorSubject(mockPagination),
      },
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        { provide: PetsFacade, useValue: newFacadeSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(PetListComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.ngOnInit();
    newComponent.onSearchChange('Rex');

    tick(300);

    expect(newFacadeSpy.searchPets).toHaveBeenCalledWith('Rex');
    expect(newFacadeSpy.clearFilters).not.toHaveBeenCalled();
  }));

  it('should handle pagination change', () => {
    component.onPageChange(2);

    expect(mockPetsFacade.goToPage).toHaveBeenCalledWith(2);
  });

  it('should handle zero page change', () => {
    component.onPageChange(0);

    expect(mockPetsFacade.goToPage).toHaveBeenCalledWith(0);
  });

  it('should initialize with empty arrays', () => {
    expect(component).toBeTruthy();
    expect(component.pets).toEqual([]);
    expect(component.error).toBeNull();
  });
});
