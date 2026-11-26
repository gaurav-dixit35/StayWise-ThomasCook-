import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelDetail, PriceBreakdown } from '../../core/models/hotel.model';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { DateRangeValue, DateRangePickerComponent } from '../../shared/ui/date-range-picker/date-range-picker.component';
import { AmenityIconComponent } from '../../shared/ui/amenity-icon/amenity-icon.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { NightsPipe } from '../../shared/pipes/nights.pipe';
import { SmartAlternativesComponent } from '../../shared/ui/smart-alternatives/smart-alternatives.component';

@Component({
  selector: 'app-hotel-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DateRangePickerComponent, AmenityIconComponent,
    InrPipe, NightsPipe, SmartAlternativesComponent],
  template: `
    @if (loading()) {
      <div class="page-status" role="status">Loading stay details…</div>
    } @else if (error()) {
      <div class="page-status" role="alert"><h1>We could not find this stay.</h1><p>{{ error() }}</p><a routerLink="/hotels">Explore other stays</a></div>
    } @else if (hotel(); as stay) {
      <article class="details-page">
        <div class="hero-image"><img [src]="stay.imageUrl" [alt]="stay.name + ' in ' + stay.city" width="1200" height="680" fetchpriority="high" (error)="fallbackImage($event)" /></div>
        <div class="details-layout">
          <div class="details-main">
            <p class="eyebrow">{{ stay.city }}, {{ stay.state }}</p>
            <div class="title-line"><h1>{{ stay.name }}</h1><span class="rating" [attr.aria-label]="stay.starRating + ' out of 5 stars'">{{ stay.starRating }} <span aria-hidden="true">★</span></span></div>
            <p class="address">{{ stay.address }}</p>
            <p class="description">{{ stay.description }}</p>
            <section class="amenities-section" aria-labelledby="amenities-title">
              <p class="eyebrow">Thoughtful details</p><h2 id="amenities-title">What this stay offers</h2>
              <div class="amenity-grid">
                @for (amenity of stay.amenities; track amenity.iconKey) {
                  <div class="amenity"><app-amenity-icon [iconKey]="amenity.iconKey" /><span>{{ amenity.name }}</span></div>
                }
              </div>
            </section>
            <section class="room-card" aria-labelledby="room-title">
              <div><p class="eyebrow">One considered room category</p><h2 id="room-title">{{ stay.roomTypeName }}</h2><p>Room for a comfortable, unhurried stay.</p></div>
              <strong>{{ stay.pricePerNight | inr }} <span>per night</span></strong>
            </section>
            @if (soldOut() && checkIn() && checkOut()) {
              <app-smart-alternatives [hotelId]="stay.id" [checkIn]="checkIn()" [checkOut]="checkOut()" />
            }
          </div>
          <aside class="booking-card" aria-labelledby="booking-title">
            <p class="eyebrow">Make it yours</p><h2 id="booking-title">Plan your stay</h2>
            <app-date-range-picker [checkIn]="checkIn()" [checkOut]="checkOut()" (rangeChange)="setDates($event)" />
            @if (stay.availability; as availability) {
              @if (checkIn() && checkOut()) {
                <p class="rooms" [class.rooms--sold-out]="!availability.available">
                  @if (availability.available) { {{ availability.roomsLeft }} {{ availability.roomsLeft === 1 ? 'room' : 'rooms' }} available }
                  @else { Sold out for these dates }
                </p>
              }
            }
            @if (quote(); as price) {
              <div class="price-summary">
                <div><span>{{ price.pricePerNight | inr }} × {{ price.nights | nights }}</span><strong>{{ price.subtotal | inr }}</strong></div>
                <div class="price-summary__total"><span>Total, no added fees</span><strong>{{ price.total | inr }}</strong></div>
              </div>
            } @else { <p class="quote-hint">Choose dates to see your full stay price.</p> }
            @if (checkIn() && checkOut() && !soldOut() && quote() && !loading()) {
              <a class="reserve-button" [routerLink]="['/hotels', stay.id, 'book']" [queryParams]="bookingParams()">Reserve this room</a>
            } @else {
              <button class="reserve-button" type="button" disabled>Choose available dates to reserve</button>
            }
            <p class="booking-note">Instant confirmation · Free cancellation before check-in</p>
          </aside>
        </div>
      </article>
    }
  `,
  styleUrl: './hotel-details.page.scss',
})
export class HotelDetailsPage implements OnInit {
  private readonly api = inject(HotelApiService);
  private readonly route = inject(ActivatedRoute);
  readonly hotel = signal<HotelDetail | null>(null);
  readonly quote = signal<PriceBreakdown | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly checkIn = signal('');
  readonly checkOut = signal('');
  readonly soldOut = computed(() => this.hotel()?.availability?.available === false && !!this.checkIn() && !!this.checkOut());

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      const query = this.route.snapshot.queryParamMap;
      this.checkIn.set(query.get('checkIn') ?? '');
      this.checkOut.set(query.get('checkOut') ?? '');
      this.load(id);
    });
    this.route.queryParamMap.subscribe((params) => {
      const checkIn = params.get('checkIn') ?? '';
      const checkOut = params.get('checkOut') ?? '';
      if (checkIn !== this.checkIn() || checkOut !== this.checkOut()) {
        this.checkIn.set(checkIn);
        this.checkOut.set(checkOut);
        const id = this.route.snapshot.paramMap.get('id') ?? '';
        if (id) this.load(id);
      }
    });
  }

  setDates(range: DateRangeValue): void {
    this.checkIn.set(range.checkIn);
    this.checkOut.set(range.checkOut);
    if (range.checkIn && range.checkOut && this.hotel()) {
      this.load(this.route.snapshot.paramMap.get('id') ?? '');
    } else this.quote.set(null);
  }

  bookingParams(): Record<string, string> { return { checkIn: this.checkIn(), checkOut: this.checkOut() }; }
  fallbackImage(event: Event): void {
    const image = event.target;
    if (image instanceof HTMLImageElement) image.src = 'assets/hotels/sea-glass-house.svg';
  }

  private load(id: string): void {
    if (!id) { this.error.set('The hotel address is not valid.'); this.loading.set(false); return; }
    this.loading.set(true);
    this.hotel.set(null);
    this.quote.set(null);
    this.error.set('');
    this.api.getHotelBySlug(id, this.checkIn() || undefined, this.checkOut() || undefined).subscribe({
      next: (hotel) => {
        this.hotel.set(hotel);
        if (!this.checkIn() || !this.checkOut()) this.quote.set(null);
      },
      error: () => { this.error.set('Try the hotel list to find another stay.'); this.loading.set(false); },
      complete: () => {
        if (this.checkIn() && this.checkOut()) {
          const hotelId = this.hotel()?.id;
          if (hotelId) this.api.quote(hotelId, this.checkIn(), this.checkOut()).subscribe({ next: (quote) => this.quote.set(quote), error: () => this.quote.set(null) });
        }
        this.loading.set(false);
      },
    });
  }
}
