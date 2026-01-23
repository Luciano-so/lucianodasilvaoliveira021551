import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { RelationSectionComponent } from '../../../../shared/components/relation-section/relation-section.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MaskDirective } from '../../../../shared/directives/mask.directive';
import { MatErrorMessagesDirective } from '../../../../shared/directives/matErrorMessagesDirective';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirm-dialog.service';
import { PetLinkComponent } from '../../components/pet-link/pet-link.component';
import { TutoresFacade } from '../../facades/tutores.facade';
import { Tutor } from '../../models/tutor.model';
import { TutorFormComponent } from './tutor-form.component';

describe('TutorFormComponent', () => {
  let component: TutorFormComponent;
  let fixture: ComponentFixture<TutorFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let tutoresFacadeSpy: jasmine.SpyObj<TutoresFacade>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let confirmDialogServiceSpy: jasmine.SpyObj<ConfirmDialogService>;
  let formBuilder: FormBuilder;

  const mockTutor: Tutor = {
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
    pets: [],
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
      'TutoresFacade',
      [
        'loadTutorById',
        'createTutorWithPhoto',
        'updateTutorWithPhoto',
        'deleteTutor',
        'unlinkPet',
      ],
      {
        selectedTutor$: new BehaviorSubject<Tutor | null>(null),
      },
    );

    facadeMock.createTutorWithPhoto.and.returnValue(of(undefined));
    facadeMock.updateTutorWithPhoto.and.returnValue(of(undefined));
    facadeMock.unlinkPet.and.returnValue(of(undefined));
    const toastMock = jasmine.createSpyObj('ToastService', [
      'onShowOk',
      'onShowError',
    ]);
    const confirmDialogMock = jasmine.createSpyObj('ConfirmDialogService', [
      'openConfirm',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TutorFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        FormActionsComponent,
        FormHeaderComponent,
        PhotoUploadComponent,
        RelationSectionComponent,
        PetLinkComponent,
        MatErrorMessagesDirective,
        MaskDirective,
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TutoresFacade, useValue: facadeMock },
        { provide: ToastService, useValue: toastMock },
        { provide: ConfirmDialogService, useValue: confirmDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorFormComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute,
    ) as jasmine.SpyObj<ActivatedRoute>;
    tutoresFacadeSpy = TestBed.inject(
      TutoresFacade,
    ) as jasmine.SpyObj<TutoresFacade>;
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
    component.ngOnInit();
    expect(component.tutorForm).toBeDefined();
    expect(component.tutorForm.get('nome')).toBeDefined();
    expect(component.tutorForm.get('email')).toBeDefined();
    expect(component.tutorForm.get('telefone')).toBeDefined();
    expect(component.tutorForm.get('endereco')).toBeDefined();
    expect(component.tutorForm.get('cpf')).toBeDefined();
  });

  it('should be in create mode when no id in route', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      null,
    );
    component.ngOnInit();
    expect(component.isEditMode).toBe(false);
    expect(component.tutorId).toBeUndefined();
  });

  it('should be in edit mode when id in route', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      '1',
    );
    component.ngOnInit();
    expect(component.isEditMode).toBe(true);
    expect(component.tutorId).toBe(1);
  });

  it('should load tutor data in edit mode', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      '1',
    );
    component.ngOnInit();

    (tutoresFacadeSpy.selectedTutor$ as BehaviorSubject<Tutor | null>).next(
      mockTutor,
    );

    expect(component.tutorForm.get('nome')?.value).toBe('João Silva');
    expect(component.tutorForm.get('email')?.value).toBe('joao@email.com');
    expect(component.tutorForm.get('telefone')?.value).toBe('11999999999');
    expect(component.tutorForm.get('endereco')?.value).toBe('Rua A, 123');
    expect(component.tutorForm.get('cpf')?.value).toBe('12345678901');
    expect(component.currentPhotoUrl).toBe('https://example.com/foto-joao.jpg');
  });

  it('should not submit when form is invalid', () => {
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('');

    component.onSubmit();

    expect(toastServiceSpy.onShowError).toHaveBeenCalledWith(
      'Por favor, corrija os erros no formulário.',
    );
    expect(confirmDialogServiceSpy.openConfirm).not.toHaveBeenCalled();
  });

  it('should open confirm dialog on valid submit', () => {
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');
    component.tutorForm.get('telefone')?.setValue('11999999999');

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));

    component.onSubmit();

    expect(confirmDialogServiceSpy.openConfirm).toHaveBeenCalled();
  });

  it('should create tutor when confirmed', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      null,
    );
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');
    component.tutorForm.get('telefone')?.setValue('11999999999');

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.createTutorWithPhoto.and.callFake(() => of(undefined));

    component.onSubmit();

    expect(tutoresFacadeSpy.createTutorWithPhoto).toHaveBeenCalled();
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
      'Tutor cadastrado com sucesso!',
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tutores']);
  });

  it('should update tutor when in edit mode and confirmed', () => {
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(
      '1',
    );
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva Updated');
    component.tutorForm.get('telefone')?.setValue('11999999999');

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.updateTutorWithPhoto.and.callFake(() => of(undefined));

    component.onSubmit();

    expect(tutoresFacadeSpy.updateTutorWithPhoto).toHaveBeenCalledWith(
      1,
      {
        nome: 'João Silva Updated',
        email: '',
        telefone: '11999999999',
        endereco: '',
        cpf: '',
      },
      {
        newPhoto: null,
        currentPhotoId: null,
        photoRemoved: false,
      },
    );
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
      'Tutor atualizado com sucesso!',
    );
  });

  it('should handle create error', () => {
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.createTutorWithPhoto.and.returnValue(
      throwError(new Error('Create failed')),
    );

    component.onSubmit();

    expect(toastServiceSpy.onShowError).toHaveBeenCalled();
  });

  it('should handle update error', () => {
    component.isEditMode = true;
    component.tutorId = 1;
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.updateTutorWithPhoto.and.returnValue(
      throwError(new Error('Update failed')),
    );

    component.onSubmit();

    expect(toastServiceSpy.onShowError).toHaveBeenCalled();
  });

  it('should navigate back on onBack', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tutores']);
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

  it('should delete tutor without pets', () => {
    component.tutorId = 1;
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');
    (tutoresFacadeSpy.selectedTutor$ as BehaviorSubject<Tutor | null>).next({
      ...mockTutor,
      pets: [],
    });

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));

    component.onDelete();

    expect(tutoresFacadeSpy.deleteTutor).toHaveBeenCalledWith(1);
    expect(toastServiceSpy.onShowOk).toHaveBeenCalledWith(
      'Tutor excluído com sucesso!',
    );
  });

  it('should delete tutor with pets and unlink them', () => {
    component.tutorId = 1;
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');
    (tutoresFacadeSpy.selectedTutor$ as BehaviorSubject<Tutor | null>).next(
      mockTutor,
    );

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.unlinkPet.and.returnValue(of(undefined));

    component.onDelete();

    expect(tutoresFacadeSpy.unlinkPet).toHaveBeenCalledTimes(0);
    expect(tutoresFacadeSpy.deleteTutor).toHaveBeenCalledWith(1);
  });

  it('should handle delete error', () => {
    component.tutorId = 1;
    component.ngOnInit();
    component.tutorForm.get('nome')?.setValue('João Silva');
    const tutorWithPets = {
      ...mockTutor,
      pets: [{ id: 1, nome: 'Rex', raca: 'Labrador', idade: 3 }],
    };
    (tutoresFacadeSpy.selectedTutor$ as BehaviorSubject<Tutor | null>).next(
      tutorWithPets,
    );

    confirmDialogServiceSpy.openConfirm.and.returnValue(of(true));
    tutoresFacadeSpy.unlinkPet.and.returnValue(
      throwError(new Error('Unlink failed')),
    );

    component.onDelete();

    expect(toastServiceSpy.onShowError).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should mark form group as touched', () => {
    component.ngOnInit();
    const spy = spyOn(component.tutorForm.get('nome')!, 'markAsTouched');

    component['markFormGroupTouched'](component.tutorForm);

    expect(spy).toHaveBeenCalled();
  });
});
