import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { PetsFacade } from '../../facades/pets.facade';
import { Pet } from '../../models/pet.model';
import { PetFormComponent } from './pet-form.component';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let petsFacadeSpy: jasmine.SpyObj<PetsFacade>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmDialogServiceSpy: jasmine.SpyObj<ConfirmDialogService>;
  let formBuilder: FormBuilder;

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
      },
    ],
  };

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const paramMapGetSpy = jasmine.createSpy('get').and.returnValue(null);
    const activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: paramMapGetSpy,
        },
      },
    });
    const facadeMock = jasmine.createSpyObj(
      'PetsFacade',
      [
        'loadPetById',
        'createPetWithPhoto',
        'updatePetWithPhoto',
        'deletePet',
        'unlinkTutor',
      ],
      {
        selectedPet$: new BehaviorSubject<Pet | null>(null),
      },
    );

    facadeMock.createPetWithPhoto.and.returnValue(of(undefined));
    facadeMock.updatePetWithPhoto.and.returnValue(of(undefined));
    facadeMock.unlinkTutor.and.returnValue(of(undefined));

    const toastMock = jasmine.createSpyObj('ToastService', [
      'onShowOk',
      'onShowError',
    ]);
    const confirmDialogMock = jasmine.createSpyObj('ConfirmDialogService', [
      'openConfirm',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PetFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PetsFacade, useValue: facadeMock },
        { provide: ToastService, useValue: toastMock },
        { provide: ConfirmDialogService, useValue: confirmDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute,
    ) as jasmine.SpyObj<ActivatedRoute>;
    petsFacadeSpy = TestBed.inject(PetsFacade) as jasmine.SpyObj<PetsFacade>;
    toastServiceSpy = TestBed.inject(
      ToastService,
    ) as jasmine.SpyObj<ToastService>;
    confirmDialogServiceSpy = TestBed.inject(
      ConfirmDialogService,
    ) as jasmine.SpyObj<ConfirmDialogService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    TestBed.runInInjectionContext(() => component.ngOnInit());
    expect(component.petForm).toBeDefined();
    expect(component.petForm.get('nome')).toBeDefined();
    expect(component.petForm.get('raca')).toBeDefined();
    expect(component.petForm.get('idade')).toBeDefined();
  });

  it('should be in create mode when no id in route', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      null,
    );
    TestBed.runInInjectionContext(() => component.ngOnInit());
    expect(component.isEditMode).toBe(false);
    expect(component.petId).toBeUndefined();
  });

  it('should be in edit mode when id in route', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      '1',
    );
    TestBed.runInInjectionContext(() => component.ngOnInit());
    expect(component.isEditMode).toBe(true);
    expect(component.petId).toBe(1);
  });

  it('should load pet data in edit mode', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      '1',
    );
    TestBed.runInInjectionContext(() => component.ngOnInit());

    (petsFacadeSpy.selectedPet$ as BehaviorSubject<Pet | null>).next(mockPet);

    expect(component.petForm.get('nome')?.value).toBe('Rex');
    expect(component.petForm.get('raca')?.value).toBe('Labrador');
    expect(component.petForm.get('idade')?.value).toBe(3);
    expect(component.currentPhotoUrl).toBe('https://example.com/foto-rex.jpg');
    expect(component.linkedTutorIds).toEqual([1]);
  });

  it('should not submit when form is invalid', () => {
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.petForm.get('nome')?.setValue('');

    TestBed.runInInjectionContext(() => component.onSubmit());

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith(
      'Por favor, corrija os erros no formulário.',
    );
    expect(confirmDialogServiceSpy.openConfirm).not.toHaveBeenCalled();
  });

  it('should open confirm dialog on valid submit', () => {
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.petForm.get('nome')?.setValue('Test Pet');
    component.petForm.get('raca')?.setValue('Test Breed');
    component.petForm.get('idade')?.setValue(2);

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));

    TestBed.runInInjectionContext(() => component.onSubmit());

    expect(confirmDialogServiceSpy.openConfirm).toHaveBeenCalled();
  });

  it('should create pet when confirmed', fakeAsync(() => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      null,
    );
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.petForm.get('nome')?.setValue('Test Pet');
    component.petForm.get('raca')?.setValue('Test Breed');
    component.petForm.get('idade')?.setValue(2);

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    petsFacadeSpy.createPetWithPhoto.and.callFake(() => of(undefined));

    TestBed.runInInjectionContext(() => component.onSubmit());
    flush();

    expect(petsFacadeSpy.createPetWithPhoto).toHaveBeenCalled();
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
      'Pet cadastrado com sucesso!',
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pets']);
  }));

  it('should update pet when in edit mode and confirmed', fakeAsync(() => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      '1',
    );
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.petForm.get('nome')?.setValue('Updated Pet');
    component.petForm.get('raca')?.setValue('Updated Breed');
    component.petForm.get('idade')?.setValue(4);

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    petsFacadeSpy.updatePetWithPhoto.and.callFake(() => of(undefined));

    TestBed.runInInjectionContext(() => component.onSubmit());
    flush();

    expect(petsFacadeSpy.updatePetWithPhoto).toHaveBeenCalledWith(
      1,
      {
        nome: 'Updated Pet',
        raca: 'Updated Breed',
        idade: 4,
      },
      {
        newPhoto: null,
        currentPhotoId: null,
        photoRemoved: false,
      },
    );
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
      'Pet atualizado com sucesso!',
    );
  }));

  it('should navigate back on onBack', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pets']);
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.onFileSelected(mockFile);

    expect(component.selectedFile).toBe(mockFile);
    expect(component.photoRemoved).toBe(false);
  });

  it('should remove photo', () => {
    component.selectedFile = new File([''], 'test.jpg');
    component.previewUrl = 'preview-url';
    component.currentPhotoUrl = 'current-url';

    component.removePhoto();

    expect(component.previewUrl).toBeNull();
    expect(component.selectedFile).toBeNull();
    expect(component.photoRemoved).toBe(true);
    expect(component.currentPhotoUrl).toBeNull();
  });

  it('should delete pet without tutors', () => {
    component.petId = 1;
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.petForm.get('nome')?.setValue('Test Pet');
    component.linkedTutorIds = [];

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));

    TestBed.runInInjectionContext(() => component.onDelete());

    expect(petsFacadeSpy.deletePet).toHaveBeenCalledWith(1);
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
      'Pet excluído com sucesso!',
    );
  });

  it('should delete pet with tutors and unlink them', fakeAsync(() => {
    component.petId = 1;
    TestBed.runInInjectionContext(() => component.ngOnInit());
    component.petForm.get('nome')?.setValue('Test Pet');
    component.linkedTutorIds = [1, 2];

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    petsFacadeSpy.unlinkTutor.and.callFake(() => of(undefined));

    TestBed.runInInjectionContext(() => component.onDelete());
    flush();

    expect(petsFacadeSpy.unlinkTutor).toHaveBeenCalledTimes(2);
    expect(petsFacadeSpy.deletePet).toHaveBeenCalledWith(1);
  }));

  it('should mark form group as touched', () => {
    TestBed.runInInjectionContext(() => component.ngOnInit());
    const spy = spyOn(component.petForm.get('nome')!, 'markAsTouched');

    component['markFormGroupTouched'](component.petForm);

    expect(spy).toHaveBeenCalled();
  });
});
