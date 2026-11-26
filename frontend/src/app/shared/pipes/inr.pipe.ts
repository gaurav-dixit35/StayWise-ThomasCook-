import { Pipe, PipeTransform } from '@angular/core';

const indianRupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

@Pipe({ name: 'inr', standalone: true, pure: true })
export class InrPipe implements PipeTransform {
  transform(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || !Number.isFinite(amount)) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
  }
}
