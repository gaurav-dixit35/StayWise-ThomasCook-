import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nights', standalone: true, pure: true })
export class NightsPipe implements PipeTransform {
  transform(nights: number | null | undefined): string {
    if (nights === null || nights === undefined || !Number.isFinite(nights)) return '';
    return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
  }
}
