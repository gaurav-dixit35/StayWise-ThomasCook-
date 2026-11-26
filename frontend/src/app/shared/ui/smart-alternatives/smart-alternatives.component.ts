import { CommonModule } from '@angular/common';
import { Component, OnChanges, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlternativesResponse } from '../../../core/models/alternatives.model';
import { HotelApiService } from '../../../core/services/hotel-api.service';
import { SearchStateService } from '../../../core/services/search-state.service';
import { InrPipe } from '../../pipes/inr.pipe';
import { SwImageComponent } from '../sw-image/sw-image.component';

@Component({
  selector: 'app-smart-alternatives',
  standalone: true,
  imports: [CommonModule, RouterLink, InrPipe, SwImageComponent],
  template: `
    @if (loading()) {
      <section class="alternatives" aria-live="polite"><p>Looking for nearby options…</p></section>
    } @else if (error()) {
      <section class="alternatives" role="alert"><p>{{ error() }}</p><button type="button" class="retry" (click)="load()">Try again</button></section>
    } @else if (result(); as options) {
      <section class="alternatives" aria-labelledby="alternatives-title">
        <div class="alternatives__intro">
          <p class="eyebrow">A helpful next step</p>
          <h2 id="alternatives-title">Here is what works instead</h2>
        </div>
        @if (options.nearbyDates.length) {
          <div class="group">
            <h3>Try nearby dates at this stay</h3>
            <div class="date-options">
              @for (window of options.nearbyDates; track window.checkIn) {
                <button class="date-chip" type="button" (click)="applyDates(window.checkIn, window.checkOut)">
                  <span>{{ window.checkIn | date:'EEE, d MMM' }} – {{ window.checkOut | date:'d MMM' }}</span>
                  <small>{{ window.roomsLeft }} rooms · {{ window.totalAmount | inr }}</small>
                </button>
              }
            </div>
          </div>
        }
        @if (options.otherHotels.length) {
          <div class="group">
            <h3>Or stay nearby in {{ options.city }}</h3>
            <div class="hotel-options">
              @for (hotel of options.otherHotels; track hotel.hotelId) {
                <a class="hotel-option" [routerLink]="['/hotels', hotel.slug]"
                   [queryParams]="{ checkIn: checkIn(), checkOut: checkOut() }">
                  <sw-image [src]="hotel.imageUrl" [alt]="hotel.name + ', ' + hotel.city" width="112" height="80" sizes="112px" />
                  <span class="hotel-option__details"><strong>{{ hotel.name }}</strong><small>{{ hotel.city }} · {{ hotel.roomsLeft }} rooms left</small></span>
                  <strong class="hotel-option__price">{{ hotel.totalAmount | inr }}</strong>
                </a>
              }
            </div>
          </div>
        }
        @if (!options.nearbyDates.length && !options.otherHotels.length) {
          <p class="empty">We could not find another option for these dates. Try changing your city or check-in day.</p>
        }
      </section>
    }
  `,
  styleUrl: './smart-alternatives.component.scss',
})
export class SmartAlternativesComponent implements OnChanges {
  readonly hotelId = input.required<number>();
  readonly checkIn = input.required<string>();
  readonly checkOut = input.required<string>();
  readonly excludeHotelIds = input<number[]>([]);
  private readonly hotels = inject(HotelApiService);
  private readonly searchState = inject(SearchStateService);
  readonly loading = signal(false);
  readonly result = signal<AlternativesResponse | null>(null);
  readonly error = signal(false);

  ngOnChanges(): void {
    if (!this.hotelId() || !this.checkIn() || !this.checkOut()) return;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.hotels.alternatives(this.hotelId(), this.checkIn(), this.checkOut()).subscribe({
      next: (result) => this.result.set({ ...result, otherHotels: result.otherHotels.filter((hotel) => !this.excludeHotelIds().includes(hotel.hotelId)) }),
      error: () => { this.result.set(null); this.error.set(true); this.loading.set(false); },
      complete: () => this.loading.set(false),
    });
  }

  applyDates(checkIn: string, checkOut: string): void {
    const city = this.result()?.city ?? '';
    void this.searchState.search({ city, checkIn, checkOut });
  }

}
