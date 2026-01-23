import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DetailActionsComponent } from './detail-actions.component';

describe('DetailActionsComponent', () => {
  let component: DetailActionsComponent;
  let fixture: ComponentFixture<DetailActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('outputs', () => {
    it('should have back output', () => {
      expect(component.back).toBeDefined();
      expect(component.back.emit).toBeDefined();
    });

    it('should have edit output', () => {
      expect(component.edit).toBeDefined();
      expect(component.edit.emit).toBeDefined();
    });
  });

  describe('onBack()', () => {
    it('should emit back event', () => {
      spyOn(component.back, 'emit');
      component.onBack();
      expect(component.back.emit).toHaveBeenCalled();
    });
  });

  describe('onEdit()', () => {
    it('should emit edit event', () => {
      spyOn(component.edit, 'emit');
      component.onEdit();
      expect(component.edit.emit).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should render back button', () => {
      const backButton = fixture.debugElement.query(
        By.css('.detail-actions__btn--cancel'),
      );
      expect(backButton).toBeTruthy();
      expect(backButton.nativeElement.textContent.trim()).toContain('Voltar');
    });

    it('should render edit button', () => {
      const editButton = fixture.debugElement.query(
        By.css('.detail-actions__btn--edit'),
      );
      expect(editButton).toBeTruthy();
      expect(editButton.nativeElement.textContent.trim()).toContain('Editar');
    });

    it('should have correct button structure', () => {
      const buttons = fixture.debugElement.queryAll(
        By.css('.detail-actions__btn'),
      );
      expect(buttons.length).toBe(2);

      buttons.forEach((button) => {
        const matIcon = button.query(By.css('mat-icon'));
        expect(matIcon).toBeTruthy();
      });
    });
  });

  describe('button clicks', () => {
    it('should call onBack when back button is clicked', () => {
      spyOn(component, 'onBack');
      const backButton = fixture.debugElement.query(
        By.css('.detail-actions__btn--cancel'),
      );
      backButton.nativeElement.click();
      expect(component.onBack).toHaveBeenCalled();
    });

    it('should call onEdit when edit button is clicked', () => {
      spyOn(component, 'onEdit');
      const editButton = fixture.debugElement.query(
        By.css('.detail-actions__btn--edit'),
      );
      editButton.nativeElement.click();
      expect(component.onEdit).toHaveBeenCalled();
    });
  });
});
