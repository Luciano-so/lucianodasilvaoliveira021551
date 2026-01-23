import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EntityPhotoComponent } from './entity-photo.component';

describe('EntityPhotoComponent', () => {
  let component: EntityPhotoComponent;
  let fixture: ComponentFixture<EntityPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityPhotoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept alt input', () => {
      component.alt = 'Test alt text';
      fixture.detectChanges();
      expect(component.alt).toBe('Test alt text');
    });

    it('should accept entityId input', () => {
      component.entityId = 123;
      fixture.detectChanges();
      expect(component.entityId).toBe(123);
    });

    it('should accept icon input', () => {
      component.icon = 'pets';
      fixture.detectChanges();
      expect(component.icon).toBe('pets');
    });

    it('should accept photoUrl input', () => {
      component.photoUrl = 'https://example.com/photo.jpg';
      fixture.detectChanges();
      expect(component.photoUrl).toBe('https://example.com/photo.jpg');
    });
  });

  describe('onImageError()', () => {
    it('should set hasError to true', () => {
      component.hasError = false;
      component.onImageError();
      expect(component.hasError).toBe(true);
    });
  });

  describe('template rendering', () => {
    it('should render image when photoUrl is set and no error', () => {
      component.photoUrl = 'https://example.com/photo.jpg';
      component.alt = 'Test photo';
      component.hasError = false;
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.src).toBe(
        'https://example.com/photo.jpg',
      );
      expect(imgElement.nativeElement.alt).toBe('Test photo');

      const placeholderElement = fixture.debugElement.query(
        By.css('.entity-photo--placeholder'),
      );
      expect(placeholderElement).toBeFalsy();
    });

    it('should render placeholder when photoUrl is null', () => {
      component.photoUrl = null;
      component.icon = 'person';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeFalsy();

      const placeholderElement = fixture.debugElement.query(
        By.css('.entity-photo--placeholder'),
      );
      expect(placeholderElement).toBeTruthy();

      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('person');
    });

    it('should render placeholder when photoUrl is undefined', () => {
      component.photoUrl = undefined;
      component.icon = 'person';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeFalsy();

      const placeholderElement = fixture.debugElement.query(
        By.css('.entity-photo--placeholder'),
      );
      expect(placeholderElement).toBeTruthy();
    });

    it('should render placeholder when hasError is true', () => {
      component.photoUrl = 'https://example.com/photo.jpg';
      component.hasError = true;
      component.icon = 'person';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeFalsy();

      const placeholderElement = fixture.debugElement.query(
        By.css('.entity-photo--placeholder'),
      );
      expect(placeholderElement).toBeTruthy();
    });

    it('should call onImageError when image fails to load', () => {
      spyOn(component, 'onImageError');
      component.photoUrl = 'https://example.com/photo.jpg';
      component.hasError = false;
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      imgElement.triggerEventHandler('error', null);

      expect(component.onImageError).toHaveBeenCalled();
    });
  });

  describe('default values', () => {
    it('should have default alt value', () => {
      expect(component.alt).toBe('');
    });

    it('should have default entityId value', () => {
      expect(component.entityId).toBe(0);
    });

    it('should have default icon value', () => {
      expect(component.icon).toBe('person');
    });

    it('should have default photoUrl value', () => {
      expect(component.photoUrl).toBe(null);
    });

    it('should have default hasError value', () => {
      expect(component.hasError).toBe(false);
    });
  });
});
