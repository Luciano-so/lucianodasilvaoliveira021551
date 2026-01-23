import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { MatErrorMessagesDirective } from './matErrorMessagesDirective';

describe('MatErrorMessagesDirective', () => {
  let directive: MatErrorMessagesDirective;
  let fixture: ComponentFixture<TestErrorMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestErrorMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestErrorMessagesComponent);
    const inputElement = fixture.debugElement.query(By.css('input'));
    directive = inputElement.injector.get(MatErrorMessagesDirective);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  describe('error message display', () => {
    it('should display required error message', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.required]);
      control.setValue('');
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain('O campo é obrigatório.');
    });

    it('should display minlength error message', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.minLength(5)]);
      control.setValue('abc');
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain(
        'O campo deverá conter no mínimo 5 caractere(s).',
      );
    });

    it('should display maxlength error message', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.maxLength(3)]);
      control.setValue('abcdef');
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain(
        'O campo deverá conter no máximo 3 caractere(s).',
      );
    });

    it('should display email error message', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.email]);
      control.setValue('invalid-email');
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain('E-Mail informado é inválido.');
    });

    it('should display min error message', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.min(10)]);
      control.setValue(5);
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain(
        'O campo deverá conter no mínimo 10.',
      );
    });

    it('should display max error message', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.max(10)]);
      control.setValue(15);
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain(
        'O campo deverá conter no máximo 10.',
      );
    });

    it('should display cpf error message', () => {
      const control = fixture.componentInstance.control;
      control.setErrors({ cpf: true });
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain('CPF informado é inválido.');
    });

    it('should display multiple error messages', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.min(10), Validators.max(5)]);
      control.setValue(7);
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain(
        'O campo deverá conter no mínimo 10.',
      );
      expect(directive.content).toContain('O campo deverá conter no máximo 5.');
      expect(directive.content).toContain('<br>');
    });

    it('should clear error messages when valid', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.required]);
      control.setValue('');
      control.markAsTouched();
      fixture.detectChanges();

      expect(directive.content).toContain('O campo é obrigatório.');

      control.setValue('valid value');
      fixture.detectChanges();

      expect(directive.content).toBe('');
    });
  });

  describe('styling updates', () => {
    it('should update styling for multiple errors', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.min(10), Validators.max(5)]);
      control.setValue(7);
      control.markAsTouched();
      fixture.detectChanges();

      const formFieldElement = fixture.debugElement.query(
        By.css('mat-form-field'),
      ).nativeElement;
      expect(formFieldElement.getAttribute('data-error-count')).toBe('2');
      expect(
        formFieldElement.style.getPropertyValue('--error-margin-bottom'),
      ).toBe('1.5rem');
    });

    it('should clear styling when no errors', () => {
      const control = fixture.componentInstance.control;
      control.setValidators([Validators.required]);
      control.setValue('valid');
      control.markAsTouched();
      fixture.detectChanges();

      const formFieldElement = fixture.debugElement.query(
        By.css('mat-form-field'),
      ).nativeElement;
      expect(formFieldElement.getAttribute('data-error-count')).toBeNull();
      expect(
        formFieldElement.style.getPropertyValue('--error-margin-bottom'),
      ).toBe('');
    });
  });

  describe('formatMessage', () => {
    it('should format min error correctly', () => {
      const template = { type: 'min', message: 'Min {0}' };
      const result = directive['formatMessage'](template, { min: 5 });
      expect(result).toBe('Min 5');
    });

    it('should format max error correctly', () => {
      const template = { type: 'max', message: 'Max {0}' };
      const result = directive['formatMessage'](template, { max: 10 });
      expect(result).toBe('Max 10');
    });

    it('should format minlength error correctly', () => {
      const template = { type: 'minlength', message: 'Min length {0}' };
      const result = directive['formatMessage'](template, {
        requiredLength: 3,
      });
      expect(result).toBe('Min length 3');
    });

    it('should format maxlength error correctly', () => {
      const template = { type: 'maxlength', message: 'Max length {0}' };
      const result = directive['formatMessage'](template, {
        requiredLength: 5,
      });
      expect(result).toBe('Max length 5');
    });

    it('should return message without replacement for other types', () => {
      const template = { type: 'required', message: 'Required field' };
      const result = directive['formatMessage'](template, {});
      expect(result).toBe('Required field');
    });
  });
});

@Component({
  template: `
    <mat-form-field>
      <mat-label>Test Field</mat-label>
      <input matInput [formControl]="control" matErrorMessages />
    </mat-form-field>
  `,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatErrorMessagesDirective,
  ],
})
class TestErrorMessagesComponent {
  control = new FormControl();
}
