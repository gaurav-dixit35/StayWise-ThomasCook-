import { Pipe, PipeTransform } from '@angular/core';

const indianRupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

@Pipe({ name: 'inr', standalone: true, pure: true })
export class InrPipe implements PipeTransform {
  transform(amount: number | null | undefined): string {
    return amount === null || amount === undefined || !Number.isFinite(amount)
      ? '—'
      : indianRupees.format(amount);
  }
}
