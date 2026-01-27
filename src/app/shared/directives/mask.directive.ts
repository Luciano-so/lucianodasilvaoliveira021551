import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
  ],
})
export class MaskDirective implements ControlValueAccessor {
  @Input() appMask: 'cpf' | 'telefone' = 'cpf';

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  writeValue(value: any): void {
    const formattedValue = value ? this.applyMask(value.toString()) : '';
    this.el.nativeElement.value = formattedValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, '');
    const formattedValue = this.applyMask(rawValue);

    input.value = formattedValue;
    this.onChange(rawValue.length > 11 ? rawValue.slice(0, 11) : rawValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private applyMask(value: string): string {
    const cleanValue = value.replace(/\D/g, '');

    if (this.appMask === 'cpf') {
      return this.maskCpf(cleanValue);
    } else if (this.appMask === 'telefone') {
      return this.maskTelefone(cleanValue);
    }

    return cleanValue;
  }

  private maskCpf(value: string): string {
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    return value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }

  private maskTelefone(value: string): string {
    value = value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length === 0) {
      return '';
    } else if (value.length <= 2) {
      return value.replace(/(\d{1,2})/, '($1');
    } else if (value.length <= 6) {
      return value.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    } else if (value.length <= 10) {
      return value.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else {
      return value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }
  }
}
