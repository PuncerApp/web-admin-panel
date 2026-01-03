import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumTitle',
  standalone: true
})
export class EnumTitlePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '-';

    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}