import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardImageComponent } from './card-image.component';

describe('CardImageComponent', () => {
  let component: CardImageComponent;
  let fixture: ComponentFixture<CardImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasPhoto()', () => {
    it('should return true when photoUrl is set and no error', () => {
      component.photoUrl = 'https://example.com/photo.jpg';
      component.hasError = false;
      expect(component.hasPhoto()).toBe(true);
    });

    it('should return false when photoUrl is null', () => {
      component.photoUrl = null;
      component.hasError = false;
      expect(component.hasPhoto()).toBe(false);
    });

    it('should return false when photoUrl is undefined', () => {
      component.photoUrl = undefined;
      component.hasError = false;
      expect(component.hasPhoto()).toBe(false);
    });

    it('should return false when hasError is true', () => {
      component.photoUrl = 'https://example.com/photo.jpg';
      component.hasError = true;
      expect(component.hasPhoto()).toBe(false);
    });
  });

  describe('onImageError()', () => {
    it('should set hasError to true', () => {
      component.hasError = false;
      component.onImageError();
      expect(component.hasError).toBe(true);
    });
  });

  describe('rendering', () => {
    it('should render image when hasPhoto is true', () => {
      component.photoUrl = 'https://example.com/photo.jpg';
      component.alt = 'Test photo';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.src).toBe(
        'https://example.com/photo.jpg',
      );
      expect(imgElement.nativeElement.alt).toBe('Test photo');

      const placeholderElement = fixture.debugElement.query(
        By.css('.card-image__placeholder'),
      );
      expect(placeholderElement).toBeFalsy();
    });

    it('should render placeholder when hasPhoto is false', () => {
      component.photoUrl = null;
      component.icon = 'person';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeFalsy();

      const placeholderElement = fixture.debugElement.query(
        By.css('.card-image__placeholder'),
      );
      expect(placeholderElement).toBeTruthy();

      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('person');

      const spanElement = fixture.debugElement.query(
        By.css('.card-image__placeholder span'),
      );
      expect(spanElement.nativeElement.textContent.trim()).toBe('Sem foto');
    });

    it('should call onImageError when image fails to load', () => {
      spyOn(component, 'onImageError');
      component.photoUrl = 'https://example.com/photo.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      imgElement.triggerEventHandler('error', null);

      expect(component.onImageError).toHaveBeenCalled();
    });
  });

  describe('inputs', () => {
    it('should accept alt input', () => {
      component.alt = 'Custom alt text';
      component.photoUrl = 'https://example.com/photo.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement.nativeElement.alt).toBe('Custom alt text');
    });

    it('should accept icon input', () => {
      component.icon = 'pets';
      component.photoUrl = null;
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('pets');
    });
  });
});
