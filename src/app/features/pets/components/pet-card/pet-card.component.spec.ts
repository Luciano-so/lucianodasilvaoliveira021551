import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { AgeFormatPipe } from '../../../../shared/pipes/age-format.pipe';
import { PetCardComponent } from './pet-card.component';

describe('PetCardComponent', () => {
  let component: PetCardComponent;
  let fixture: ComponentFixture<PetCardComponent>;
  let router: Router;

  const mockPet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
    foto: {
      id: 1,
      nome: 'pet-photo.jpg',
      contentType: 'image/jpeg',
      url: 'https://example.com/pet-photo.jpg',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetCardComponent, RouterTestingModule, MatIconModule],
      providers: [AgeFormatPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(PetCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    component.pet = mockPet;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display pet name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.pet-card__name');
    expect(nameElement?.textContent?.trim()).toBe('Rex');
  });

  it('should display pet age when available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ageElements = compiled.querySelectorAll('.pet-card__detail-text');
    const ageText = Array.from(ageElements).find(
      (el) =>
        el.textContent?.includes('anos') || el.textContent?.includes('ano'),
    );
    expect(ageText).toBeTruthy();
  });

  it('should display pet breed when available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const breedElements = compiled.querySelectorAll('.pet-card__detail-text');
    const breedText = Array.from(breedElements).find(
      (el) => el.textContent?.trim() === 'Labrador',
    );
    expect(breedText).toBeTruthy();
  });

  it('should not display age when pet age is not available', () => {
    const petWithoutAge = {
      id: 1,
      nome: 'Rex',
      raca: 'Labrador',
      foto: {
        id: 1,
        nome: 'pet-photo.jpg',
        contentType: 'image/jpeg',
        url: 'https://example.com/pet-photo.jpg',
      },
    };
    component.pet = petWithoutAge as any;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const ageElements = compiled.querySelectorAll('.pet-card__detail');
    const ageDetail = Array.from(ageElements).find(
      (el) => el.querySelector('mat-icon')?.textContent?.trim() === 'cake',
    );
    expect(ageDetail).toBeFalsy();
  });

  it('should not display breed when pet breed is not available', () => {
    const petWithoutBreed = {
      id: 1,
      nome: 'Rex',
      idade: 3,
      foto: {
        id: 1,
        nome: 'pet-photo.jpg',
        contentType: 'image/jpeg',
        url: 'https://example.com/pet-photo.jpg',
      },
    };
    component.pet = petWithoutBreed as any;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const breedElements = compiled.querySelectorAll('.pet-card__detail');
    const breedDetail = Array.from(breedElements).find(
      (el) => el.querySelector('mat-icon')?.textContent?.trim() === 'category',
    );
    expect(breedDetail).toBeFalsy();
  });

  it('should navigate to pet detail on card click', () => {
    spyOn(router, 'navigate');

    const cardElement = fixture.nativeElement.querySelector('.pet-card');
    cardElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['/pets', 1]);
  });

  it('should pass correct props to CardImageComponent', () => {
    const cardImageComponent = fixture.debugElement.query(
      (de) => de.componentInstance instanceof CardImageComponent,
    );

    expect(cardImageComponent).toBeTruthy();
    expect(cardImageComponent.componentInstance.photoUrl).toBe(
      'https://example.com/pet-photo.jpg',
    );
    expect(cardImageComponent.componentInstance.alt).toBe('Rex');
    expect(cardImageComponent.componentInstance.icon).toBe('pets');
  });
});
