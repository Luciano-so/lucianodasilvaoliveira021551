import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormHeaderComponent } from './form-header.component';

describe('FormHeaderComponent', () => {
  let component: FormHeaderComponent;
  let fixture: ComponentFixture<FormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept title input', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(
        By.css('.form-header__title'),
      );
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
    });

    it('should accept subtitle input', () => {
      component.subtitle = 'Test Subtitle';
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(
        By.css('.form-header__subtitle'),
      );
      expect(subtitleElement.nativeElement.textContent.trim()).toBe(
        'Test Subtitle',
      );
    });

    it('should accept icon input', () => {
      component.icon = 'person';
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('.form-header__icon'),
      );
      expect(iconElement.nativeElement.textContent.trim()).toBe('person');
    });

    it('should accept showBackButton input', () => {
      component.showBackButton = false;
      fixture.detectChanges();
      const backButton = fixture.debugElement.query(
        By.css('.form-header__back-btn'),
      );
      expect(backButton).toBeFalsy();
    });
  });

  describe('outputs', () => {
    it('should have backClick output', () => {
      expect(component.backClick).toBeDefined();
      expect(component.backClick.emit).toBeDefined();
    });
  });

  describe('onBackClick()', () => {
    it('should emit backClick event', () => {
      spyOn(component.backClick, 'emit');
      component.onBackClick();
      expect(component.backClick.emit).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should render title', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(
        By.css('.form-header__title'),
      );
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
    });

    it('should render subtitle', () => {
      component.subtitle = 'Test Subtitle';
      fixture.detectChanges();
      const subtitleElement = fixture.debugElement.query(
        By.css('.form-header__subtitle'),
      );
      expect(subtitleElement.nativeElement.textContent.trim()).toBe(
        'Test Subtitle',
      );
    });

    it('should render icon', () => {
      component.icon = 'pets';
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('.form-header__icon'),
      );
      expect(iconElement.nativeElement.textContent.trim()).toBe('pets');
    });

    it('should render back button when showBackButton is true', () => {
      component.showBackButton = true;
      fixture.detectChanges();
      const backButton = fixture.debugElement.query(
        By.css('.form-header__back-btn'),
      );
      expect(backButton).toBeTruthy();
    });

    it('should not render back button when showBackButton is false', () => {
      component.showBackButton = false;
      fixture.detectChanges();
      const backButton = fixture.debugElement.query(
        By.css('.form-header__back-btn'),
      );
      expect(backButton).toBeFalsy();
    });

    it('should have correct structure', () => {
      component.title = 'Test';
      component.subtitle = 'Subtitle';
      component.icon = 'pets';
      component.showBackButton = true;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.form-header'))).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.form-header__content')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.form-header__title')),
      ).toBeTruthy();
      expect(
        fixture.debugElement.query(By.css('.form-header__subtitle')),
      ).toBeTruthy();
    });
  });

  describe('button clicks', () => {
    it('should call onBackClick when back button is clicked', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      spyOn(component, 'onBackClick');
      const backButton = fixture.debugElement.query(
        By.css('.form-header__back-btn'),
      );
      backButton.nativeElement.click();
      expect(component.onBackClick).toHaveBeenCalled();
    });
  });

  describe('default values', () => {
    it('should have default title value', () => {
      expect(component.title).toBe('');
    });

    it('should have default subtitle value', () => {
      expect(component.subtitle).toBe('');
    });

    it('should have default icon value', () => {
      expect(component.icon).toBe('pets');
    });

    it('should have default showBackButton value', () => {
      expect(component.showBackButton).toBe(true);
    });
  });
});
