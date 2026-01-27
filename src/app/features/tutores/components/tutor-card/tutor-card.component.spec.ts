import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { Tutor } from '../../models/tutor.model';
import { TutorCardComponent } from './tutor-card.component';

describe('TutorCardComponent', () => {
  let component: TutorCardComponent;
  let fixture: ComponentFixture<TutorCardComponent>;
  let router: Router;

  const mockTutor: Tutor = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    endereco: 'Rua A, 123',
    cpf: 12345678901,
    pets: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TutorCardComponent,
        RouterTestingModule,
        MatIconModule,
        CardImageComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    component.tutor = mockTutor;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tutor information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('João Silva');
    expect(compiled.textContent).toContain('(11) 99999-9999');
    expect(compiled.textContent).toContain('joao@email.com');
    expect(compiled.textContent).toContain('Rua A, 123');
  });

  it('should navigate to tutor detail on card click', () => {
    spyOn(router, 'navigate');
    const card = fixture.nativeElement.querySelector('.tutor-card');
    card.click();
    expect(router.navigate).toHaveBeenCalledWith(['/tutores', 1]);
  });
});
