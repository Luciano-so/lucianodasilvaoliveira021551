import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { EntityPhotoComponent } from '../../../../shared/components/entity-photo/entity-photo.component';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { Tutor } from '../../../tutores/models/tutor.model';
import { PetsFacade } from '../../facades/pets.facade';
import { TutorLinkComponent } from './tutor-link.component';

describe('TutorLinkComponent', () => {
  let component: TutorLinkComponent;
  let fixture: ComponentFixture<TutorLinkComponent>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;

  const mockTutors: Tutor[] = [
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
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '11888888888',
      endereco: 'Rua B, 456',
      cpf: 98765432109,
    },
  ];

  const mockPet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
    tutores: mockTutors,
  };

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj('PetsFacade', [], {
      selectedPet$: new BehaviorSubject(mockPet),
    });

    await TestBed.configureTestingModule({
      imports: [
        TutorLinkComponent,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [
        PhoneFormatPipe,
        { provide: PetsFacade, useValue: facadeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorLinkComponent);
    component = fixture.componentInstance;
    petsFacadeSpy = TestBed.inject(PetsFacade) as jasmine.SpyObj<PetsFacade>;

    component.petId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load linked tutors on init', () => {
    expect(component.linkedTutors).toEqual(mockTutors);
  });

  it('should display tutor list when tutors exist', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tutorItems = compiled.querySelectorAll('.tutor-link__item');
    expect(tutorItems.length).toBe(2);

    const firstTutorName = compiled.querySelector('.tutor-link__item-name');
    expect(firstTutorName?.textContent?.trim()).toBe('João Silva');
  });

  it('should display empty state when no tutors exist', () => {
    (petsFacadeSpy.selectedPet$ as BehaviorSubject<any>).next({
      ...mockPet,
      tutores: [],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.tutor-link__empty');
    expect(emptyState).toBeTruthy();

    const emptyText = emptyState?.querySelector('p');
    expect(emptyText?.textContent?.trim()).toBe('Nenhum tutor vinculado');
  });

  it('should not display tutors when pet id does not match', () => {
    component.petId = 999;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.linkedTutors).toEqual([]);
  });

  it('should display tutor phone with formatting', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const phoneElements = compiled.querySelectorAll('.tutor-link__item-phone');
    expect(phoneElements.length).toBeGreaterThan(0);
    expect(phoneElements[0]?.textContent?.trim()).toBeTruthy();
  });

  it('should display tutor email when available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailElements = compiled.querySelectorAll('.tutor-link__item-email');
    expect(emailElements.length).toBeGreaterThan(0);
    expect(emailElements[0]?.textContent?.trim()).toBe('joao@email.com');
  });

  it('should not display email when tutor has no email', () => {
    const tutorWithoutEmail = { ...mockTutors[1], email: undefined };
    (petsFacadeSpy.selectedPet$ as BehaviorSubject<any>).next({
      ...mockPet,
      tutores: [tutorWithoutEmail],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emailElements = compiled.querySelectorAll('.tutor-link__item-email');
    expect(emailElements.length).toBe(0);
  });

  it('should pass correct props to EntityPhotoComponent', () => {
    const tutorLinkElement = fixture.debugElement.query(
      By.css('mat-card.tutor-link'),
    );
    const entityPhotoComponents = tutorLinkElement.queryAll(
      By.directive(EntityPhotoComponent),
    );

    expect(entityPhotoComponents.length).toBe(2);
    expect(entityPhotoComponents[0].componentInstance.photoUrl).toBe(
      'https://example.com/foto-joao.jpg',
    );
    expect(entityPhotoComponents[0].componentInstance.alt).toBe('João Silva');
    expect(entityPhotoComponents[0].componentInstance.icon).toBe('person');
    expect(entityPhotoComponents[0].componentInstance.entityId).toBe(1);

    expect(entityPhotoComponents[1].componentInstance.photoUrl).toBe(null);
    expect(entityPhotoComponents[1].componentInstance.alt).toBe('Maria Santos');
    expect(entityPhotoComponents[1].componentInstance.icon).toBe('person');
    expect(entityPhotoComponents[1].componentInstance.entityId).toBe(2);
  });

  it('should handle readOnly input', () => {
    component.readOnly = true;
    expect(component.readOnly).toBe(true);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
