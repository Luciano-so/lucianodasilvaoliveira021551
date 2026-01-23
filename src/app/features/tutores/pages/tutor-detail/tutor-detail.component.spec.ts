import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { DetailActionsComponent } from '../../../../shared/components/detail-actions/detail-actions.component';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { RelationSectionComponent } from '../../../../shared/components/relation-section/relation-section.component';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { PetLinkComponent } from '../../components/pet-link/pet-link.component';
import { TutoresFacade } from '../../facades/tutores.facade';
import { Tutor } from '../../models/tutor.model';
import { TutorDetailComponent } from './tutor-detail.component';

describe('TutorDetailComponent', () => {
  let component: TutorDetailComponent;
  let fixture: ComponentFixture<TutorDetailComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let tutoresFacadeSpy: jasmine.SpyObj<TutoresFacade>;

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
    const paramMapGetSpy = jasmine.createSpy('get').and.returnValue('1');
    const activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: paramMapGetSpy,
        },
      },
    });

    const tutoresFacadeMock = jasmine.createSpyObj(
      'TutoresFacade',
      ['loadTutorById'],
      {
        selectedTutor$: new BehaviorSubject<Tutor | null>(null),
      },
    );

    await TestBed.configureTestingModule({
      imports: [
        TutorDetailComponent,
        RouterTestingModule,
        CardImageComponent,
        DetailActionsComponent,
        FormHeaderComponent,
        RelationSectionComponent,
        PetLinkComponent,
        PhoneFormatPipe,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TutoresFacade, useValue: tutoresFacadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tutoresFacadeSpy = TestBed.inject(
      TutoresFacade,
    ) as jasmine.SpyObj<TutoresFacade>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tutor on init', () => {
    component.ngOnInit();
    expect(component.tutorId).toBe(1);
    expect(tutoresFacadeSpy.loadTutorById).toHaveBeenCalledWith(1);
  });

  it('should set tutor when selectedTutor$ emits', () => {
    component.ngOnInit();
    (tutoresFacadeSpy.selectedTutor$ as BehaviorSubject<Tutor | null>).next(
      mockTutor,
    );
    expect(component.tutor).toEqual(mockTutor);
  });

  it('should navigate back on onBack', () => {
    spyOn(router, 'navigate');
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/tutores']);
  });

  it('should navigate to edit on onEdit', () => {
    spyOn(router, 'navigate');
    component.tutorId = 1;
    component.onEdit();
    expect(router.navigate).toHaveBeenCalledWith(['/tutores', 1, 'edit']);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
