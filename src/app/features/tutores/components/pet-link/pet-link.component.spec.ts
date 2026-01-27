import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, of } from 'rxjs';
import { EntityPhotoComponent } from '../../../../shared/components/entity-photo/entity-photo.component';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { PetsFacade } from '../../../pets/facades/pets.facade';
import { Pet } from '../../../pets/models/pet.model';
import { TutoresFacade } from '../../facades/tutores.facade';
import { Tutor } from '../../models/tutor.model';
import { PetLinkComponent } from './pet-link.component';

describe('PetLinkComponent', () => {
  let component: PetLinkComponent;
  let fixture: ComponentFixture<PetLinkComponent>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;
  let tutoresFacadeSpy: jasmine.SpyObj<TutoresFacade>;
  let confirmDialogServiceSpy: jasmine.SpyObj<ConfirmDialogService>;

  const mockTutor: Tutor = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    endereco: 'Rua A, 123',
    cpf: 12345678901,
    pets: [
      {
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
      },
    ],
  };

  const mockPet: Pet = {
    id: 2,
    nome: 'Bella',
    raca: 'Poodle',
    idade: 2,
    foto: {
      id: 2,
      nome: 'foto-bella.jpg',
      contentType: 'image/jpeg',
      url: 'https://example.com/foto-bella.jpg',
    },
  };

  beforeEach(async () => {
    const petsFacadeMock = jasmine.createSpyObj('PetsFacade', ['loadPets'], {
      pets$: new BehaviorSubject<Pet[]>([mockPet]),
    });

    const tutoresFacadeMock = jasmine.createSpyObj(
      'TutoresFacade',
      ['linkPet', 'unlinkPet'],
      {
        selectedTutor$: new BehaviorSubject<Tutor | null>(mockTutor),
      },
    );

    const confirmDialogMock = jasmine.createSpyObj('ConfirmDialogService', [
      'openConfirm',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PetLinkComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        EntityPhotoComponent,
      ],
      providers: [
        { provide: PetsFacade, useValue: petsFacadeMock },
        { provide: TutoresFacade, useValue: tutoresFacadeMock },
        { provide: ConfirmDialogService, useValue: confirmDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetLinkComponent);
    component = fixture.componentInstance;
    petsFacadeSpy = TestBed.inject(PetsFacade) as jasmine.SpyObj<PetsFacade>;
    tutoresFacadeSpy = TestBed.inject(
      TutoresFacade,
    ) as jasmine.SpyObj<TutoresFacade>;
    confirmDialogServiceSpy = TestBed.inject(
      ConfirmDialogService,
    ) as jasmine.SpyObj<ConfirmDialogService>;

    component.tutorId = 1;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with inputs', () => {
    component.readOnly = true;
    component.ngOnInit();
    expect(component.tutorId).toBe(1);
    expect(component.readOnly).toBe(true);
  });

  it('should load linked pets on init', () => {
    component.ngOnInit();
    expect(component.linkedPets).toEqual(mockTutor.pets!);
  });

  it('should load available pets excluding linked ones', () => {
    component.ngOnInit();
    expect(component.availablePets!).toEqual([mockPet]);
  });

  it('should link pet when selected', () => {
    component.ngOnInit();
    component.selectedPetControl.setValue(2);
    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.linkPet.and.returnValue(of(undefined));

    component.onLinkPet();

    expect(confirmDialogServiceSpy.openConfirm).toHaveBeenCalled();
    expect(tutoresFacadeSpy.linkPet).toHaveBeenCalledWith(1, 2);
    expect(component.selectedPetControl.value).toBeNull();
  });

  it('should not link pet when none selected', () => {
    component.ngOnInit();
    component.selectedPetControl.setValue(null);

    component.onLinkPet();

    expect(tutoresFacadeSpy.linkPet).not.toHaveBeenCalled();
  });

  it('should unlink pet after confirmation', () => {
    component.ngOnInit();
    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.unlinkPet.and.returnValue(of(undefined));

    component.onUnlinkPet(1);

    expect(confirmDialogServiceSpy.openConfirm).toHaveBeenCalled();
    expect(tutoresFacadeSpy.unlinkPet).toHaveBeenCalledWith(1, 1);
  });

  it('should not unlink pet when not confirmed', () => {
    component.ngOnInit();
    confirmDialogServiceSpy.openConfirm.and.returnValue(of(false));

    component.onUnlinkPet(1);

    expect(tutoresFacadeSpy.unlinkPet).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
