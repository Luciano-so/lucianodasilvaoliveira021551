import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '';

    const phoneStr = value.toString().replace(/\D/g, '');

    if (phoneStr.length === 11) {
      return `(${phoneStr.slice(0, 2)}) ${phoneStr.slice(2, 7)}-${phoneStr.slice(7)}`;
    } else if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 2)}) ${phoneStr.slice(2, 6)}-${phoneStr.slice(6)}`;
    }

    return phoneStr;
  }
}
