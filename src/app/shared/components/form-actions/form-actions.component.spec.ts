import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormActionsComponent } from './form-actions.component';

describe('FormActionsComponent', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept isEditMode input', () => {
      component.isEditMode = true;
      fixture.detectChanges();
      expect(component.isEditMode).toBe(true);
    });

    it('should accept formInvalid input', () => {
      component.formInvalid = true;
      fixture.detectChanges();
      expect(component.formInvalid).toBe(true);
    });
  });

  describe('outputs', () => {
    it('should have cancel output', () => {
      expect(component.cancel).toBeDefined();
      expect(component.cancel.emit).toBeDefined();
    });

    it('should have delete output', () => {
      expect(component.delete).toBeDefined();
      expect(component.delete.emit).toBeDefined();
    });

    it('should have submit output', () => {
      expect(component.submit).toBeDefined();
      expect(component.submit.emit).toBeDefined();
    });
  });

  describe('methods', () => {
    it('should emit cancel event on onCancel', () => {
      spyOn(component.cancel, 'emit');
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalled();
    });

    it('should emit delete event on onDelete', () => {
      spyOn(component.delete, 'emit');
      component.onDelete();
      expect(component.delete.emit).toHaveBeenCalled();
    });

    it('should emit submit event on onSubmit', () => {
      spyOn(component.submit, 'emit');
      component.onSubmit();
      expect(component.submit.emit).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should render cancel button', () => {
      const cancelButton = fixture.debugElement.query(
        By.css('.form-actions__cancel-btn'),
      );
      expect(cancelButton).toBeTruthy();
      expect(cancelButton.nativeElement.textContent.trim()).toContain(
        'Cancelar',
      );
    });

    it('should render submit button', () => {
      const submitButton = fixture.debugElement.query(
        By.css('.form-actions__submit-btn'),
      );
      expect(submitButton).toBeTruthy();
    });

    it('should not render delete button in create mode', () => {
      component.isEditMode = false;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('.form-actions__delete-btn'),
      );
      expect(deleteButton).toBeFalsy();
    });

    it('should render delete button in edit mode', () => {
      component.isEditMode = true;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('.form-actions__delete-btn'),
      );
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.nativeElement.textContent.trim()).toContain(
        'Excluir',
      );
    });

    it('should show "Cadastrar" text in create mode', () => {
      component.isEditMode = false;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('.form-actions__submit-btn'),
      );
      expect(submitButton.nativeElement.textContent.trim()).toContain(
        'Cadastrar',
      );
    });

    it('should show "Salvar" text in edit mode', () => {
      component.isEditMode = true;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('.form-actions__submit-btn'),
      );
      expect(submitButton.nativeElement.textContent.trim()).toContain('Salvar');
    });

    it('should disable submit button when formInvalid is true', () => {
      component.formInvalid = true;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('.form-actions__submit-btn'),
      );
      expect(submitButton.nativeElement.disabled).toBe(true);
    });

    it('should enable submit button when formInvalid is false', () => {
      component.formInvalid = false;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('.form-actions__submit-btn'),
      );
      expect(submitButton.nativeElement.disabled).toBe(false);
    });

    it('should have correct CSS classes', () => {
      component.isEditMode = true;
      fixture.detectChanges();

      const formActions = fixture.debugElement.query(By.css('.form-actions'));
      expect(formActions.classes['form-actions--no-delete']).toBeFalsy();

      component.isEditMode = false;
      fixture.detectChanges();

      expect(formActions.classes['form-actions--no-delete']).toBe(true);
    });
  });

  describe('button clicks', () => {
    it('should call onCancel when cancel button is clicked', () => {
      spyOn(component, 'onCancel');
      const cancelButton = fixture.debugElement.query(
        By.css('.form-actions__cancel-btn'),
      );
      cancelButton.nativeElement.click();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onSubmit when submit button is clicked', () => {
      spyOn(component, 'onSubmit');
      const submitButton = fixture.debugElement.query(
        By.css('.form-actions__submit-btn'),
      );
      submitButton.nativeElement.click();
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should call onDelete when delete button is clicked in edit mode', () => {
      component.isEditMode = true;
      fixture.detectChanges();

      spyOn(component, 'onDelete');
      const deleteButton = fixture.debugElement.query(
        By.css('.form-actions__delete-btn'),
      );
      deleteButton.nativeElement.click();
      expect(component.onDelete).toHaveBeenCalled();
    });
  });

  describe('default values', () => {
    it('should have default isEditMode value', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should have default formInvalid value', () => {
      expect(component.formInvalid).toBe(false);
    });
  });
});
