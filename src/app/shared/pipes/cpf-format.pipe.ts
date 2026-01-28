import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormat',
  standalone: true,
})
export class CpfFormatPipe implements PipeTransform {
  transform(
    value: string | number | null | undefined,
    showEmptyText: boolean = false,
  ): string {
    if (!value) return showEmptyText ? 'Não informado' : '';

    const cpfStr = value.toString().replace(/\D/g, '');

    if (cpfStr.length === 11) {
      return `${cpfStr.slice(0, 3)}.${cpfStr.slice(3, 6)}.${cpfStr.slice(6, 9)}-${cpfStr.slice(9)}`;
    }

    return cpfStr;
  }
}