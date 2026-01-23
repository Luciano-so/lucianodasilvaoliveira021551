import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MaskDirective } from './mask.directive';

describe('MaskDirective', () => {
  let fixture: ComponentFixture<TestMaskComponent>;
  let component: TestMaskComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CPF masking', () => {
    it('should mask CPF input correctly', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      input.value = '12345678901';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('123.456.789-01');
      expect(component.control.value).toBe('12345678901');
    });

    it('should handle partial CPF input', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      input.value = '123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('123');
    });
  });

  describe('Telefone masking', () => {
    beforeEach(() => {
      component.maskType = 'telefone';
      component.control = new FormControl();
      fixture.detectChanges();
    });

    it('should mask telefone input correctly', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      input.value = '12345678901';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.value).toBe('(12) 34567-8901');
      expect(component.control.value).toBe('12345678901');
    });
  });

  describe('ControlValueAccessor integration', () => {
    it('should write value to input when form control value changes', () => {
      component.control.setValue('12345678901');
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      expect(input.value).toBe('123.456.789-01');
    });

    it('should handle empty value', () => {
      component.control.setValue(null);
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      expect(input.value).toBe('');
    });

    it('should update form control value on input', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      input.value = '123.456.789-01';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.control.value).toBe('12345678901');
    });

    it('should handle blur event', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;

      spyOn(component.control, 'markAsTouched');

      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    });
  });
});

@Component({
  template: '<input [formControl]="control" [appMask]="maskType">',
  imports: [ReactiveFormsModule, MaskDirective],
})
class TestMaskComponent {
  control = new FormControl();
  maskType: string = 'cpf';
}
