import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { AgeFormatPipe } from '../../../../shared/pipes/age-format.pipe';
import { PetsFacade } from '../../facades/pets.facade';
import { Pet } from '../../models/pet.model';
import { PetDetailComponent } from './pet-detail.component';

describe('PetDetailComponent', () => {
  let component: PetDetailComponent;
  let fixture: ComponentFixture<PetDetailComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;

  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
    foto: {
      id: 1,
      nome: 'foto-rex.jpg',
      contentType: 'image/jpeg',
      url: 'https://example.com/foto-rex.jpg',
    },
    tutores: [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        cpf: 12345678901,
        foto: {
          id: 1,
          nome: 'foto-joao.jpg',
          contentType: 'image/jpeg',
          url: 'https://example.com/foto-joao.jpg',
        },
      },
    ],
  };

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    });
    const facadeMock = jasmine.createSpyObj('PetsFacade', ['loadPetById'], {
      selectedPet$: new BehaviorSubject<Pet | null>(null),
    });

    await TestBed.configureTestingModule({
      imports: [
        PetDetailComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        AgeFormatPipe,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PetsFacade, useValue: facadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetailComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute,
    ) as jasmine.SpyObj<ActivatedRoute>;
    petsFacadeSpy = TestBed.inject(PetsFacade) as jasmine.SpyObj<PetsFacade>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet on init', () => {
    component.ngOnInit();
    expect(petsFacadeSpy.loadPetById).toHaveBeenCalledWith(1);
  });

  it('should set petId from route params', () => {
    component.ngOnInit();
    expect(component.petId).toBe(1);
  });

  it('should update pet when selectedPet$ emits matching pet', () => {
    component.petId = 1;
    component.ngOnInit();

    (petsFacadeSpy.selectedPet$ as BehaviorSubject<Pet | null>).next(mockPet);

    expect(component.pet).toEqual(mockPet);
  });

  it('should not update pet when selectedPet$ emits non-matching pet', () => {
    component.petId = 1;
    component.ngOnInit();

    const differentPet = { ...mockPet, id: 2 };
    (petsFacadeSpy.selectedPet$ as BehaviorSubject<Pet | null>).next(
      differentPet,
    );

    expect(component.pet).toBeNull();
  });

  it('should display pet information when pet is loaded', () => {
    component.pet = mockPet;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const petName = compiled.querySelector('.pet-detail__field-value');
    expect(petName?.textContent?.trim()).toBe('Rex');
  });

  it('should display default title when pet is not loaded', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('app-form-header');
    expect(title).toBeTruthy();
  });

  it('should navigate back on onBack', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pets']);
  });

  it('should navigate to edit on onEdit', () => {
    component.petId = 1;
    component.onEdit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pets', 1, 'edit']);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should handle pet without photo', () => {
    const petWithoutPhoto = { ...mockPet, foto: undefined };
    component.pet = petWithoutPhoto;
    fixture.detectChanges();

    expect(component.pet).toBeTruthy();
  });

  it('should handle pet without race', () => {
    const petWithoutRace = { ...mockPet };
    delete petWithoutRace.raca;
    component.pet = petWithoutRace;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const raceValue = compiled.querySelectorAll('.pet-detail__field-value')[1];
    expect(raceValue?.textContent?.trim()).toBe('Não informada');
  });

  it('should pass correct props to child components', () => {
    component.pet = mockPet;
    component.petId = 1;
    fixture.detectChanges();

    const formHeader = fixture.debugElement.queryAll(
      (de) => de.componentInstance instanceof FormHeaderComponent,
    )[0];
    expect(formHeader.componentInstance.title).toBe('Rex');
    expect(formHeader.componentInstance.icon).toBe('pets');
    expect(formHeader.componentInstance.showBackButton).toBe(true);

    const cardImage = fixture.debugElement.queryAll(
      (de) => de.componentInstance instanceof CardImageComponent,
    )[0];
    expect(cardImage.componentInstance.photoUrl).toBe(
      'https://example.com/foto-rex.jpg',
    );
    expect(cardImage.componentInstance.alt).toBe('Rex');
    expect(cardImage.componentInstance.icon).toBe('photo_camera');
  });
});
