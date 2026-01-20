import { AfterViewInit, DestroyRef, Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

interface ErrorTemplate {
  type: string;
  message: string;
}

const ERROR_TEMPLATES: ReadonlyArray<ErrorTemplate> = [
  { type: 'required', message: 'O campo é obrigatório.' },
  {
    type: 'minlength',
    message: 'O campo deverá conter no mínimo {0} caractere(s).',
  },
  {
    type: 'maxlength',
    message: 'O campo deverá conter no máximo {0} caractere(s).',
  },
  { type: 'max', message: 'O campo deverá conter no máximo {0}.' },
  { type: 'min', message: 'O campo deverá conter no mínimo {0}.' },
] as const;

const EXTRA_HEIGHT_PER_ERROR = 1.5;
const DATA_ERROR_COUNT = 'data-error-count';
const CSS_ERROR_MARGIN = '--error-margin-bottom';

@Directive({
  selector: '[matErrorMessages]',
  standalone: true,
  host: {
    '[innerHTML]': 'content',
    class: 'mat-error-messages',
  },
})
export class MatErrorMessagesDirective implements AfterViewInit {
  content = '';

  private readonly formField = inject(MatFormField);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    const control = (this.formField._control as MatInput | undefined)
      ?.ngControl;

    if (!control) {
      return;
    }

    control.statusChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) =>
        this.updateErrors(state === 'INVALID' ? control.errors : null),
      );
  }

  private updateErrors(errors: Record<string, any> | null): void {
    const element = this.formField._elementRef.nativeElement;

    if (errors) {
      const messages = this.buildMessages(errors);
      this.content = messages.join('<br>');
      this.updateStyling(element, messages.length);
    } else {
      this.content = '';
      this.updateStyling(element, 0);
    }
  }

  private buildMessages(errors: Record<string, any>): string[] {
    return Object.keys(errors)
      .map((type) => {
        const template = ERROR_TEMPLATES.find((t) => t.type === type);
        return template ? this.formatMessage(template, errors[type]) : null;
      })
      .filter((msg): msg is string => msg !== null);
  }

  private formatMessage(template: ErrorTemplate, value: any): string {
    const replacements: Record<string, () => string> = {
      min: () => value.min,
      max: () => value.max,
      minlength: () => value.requiredLength,
      maxlength: () => value.requiredLength,
    };

    const getValue = replacements[template.type];
    return getValue
      ? template.message.replace('{0}', getValue())
      : template.message;
  }

  private updateStyling(element: HTMLElement, count: number): void {
    if (count > 1) {
      const extraHeight = (count - 1) * EXTRA_HEIGHT_PER_ERROR;
      element.setAttribute(DATA_ERROR_COUNT, count.toString());
      element.style.setProperty(CSS_ERROR_MARGIN, `${extraHeight}rem`);
    } else {
      element.removeAttribute(DATA_ERROR_COUNT);
      element.style.removeProperty(CSS_ERROR_MARGIN);
    }
  }
}
