import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageFormat',
  standalone: true,
})
export class AgeFormatPipe implements PipeTransform {
  transform(
    idade: number | null | undefined,
    showEmptyText: boolean = false,
  ): string {
    if (idade === null || idade === undefined) {
      return showEmptyText ? 'Não informada' : '';
    }
    if (idade === 1) {
      return '1 ano';
    }
    return `${idade} anos`;
  }
}
