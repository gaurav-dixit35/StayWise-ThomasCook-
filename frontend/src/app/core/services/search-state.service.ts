import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export interface SearchCriteria {
  city: string;
  checkIn: string;
  checkOut: string;
}

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly criteria = toSignal(this.route.queryParamMap.pipe(map((params) => ({
    city: params.get('city') ?? '',
    checkIn: params.get('checkIn') ?? '',
    checkOut: params.get('checkOut') ?? '',
  }))), { initialValue: { city: '', checkIn: '', checkOut: '' } });

  async search(criteria: SearchCriteria): Promise<boolean> {
    return this.router.navigate(['/hotels'], {
      queryParams: {
        city: criteria.city || null,
        checkIn: criteria.checkIn || null,
        checkOut: criteria.checkOut || null,
      },
    });
  }
}
