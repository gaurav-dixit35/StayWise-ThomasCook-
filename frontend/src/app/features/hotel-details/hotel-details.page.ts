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
import { SwImageComponent } from '../../shared/ui/sw-image/sw-image.component';

@Component({
  selector: 'app-hotel-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DateRangePickerComponent, AmenityIconComponent,
    InrPipe, NightsPipe, SmartAlternativesComponent, SwImageComponent],
  template: `
    @if (loading()) {
      <div class="page-status" role="status">Loading stay details…</div>
    } @else if (error()) {
      <div class="page-status" role="alert"><h1>We could not find this stay.</h1><p>{{ error() }}</p><a routerLink="/hotels">Explore other stays</a></div>
    } @else if (hotel(); as stay) {
      <article class="details-page">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a><span>›</span><a routerLink="/hotels" [queryParams]="{city: stay.city}">{{ stay.city }}</a><span>›</span><span>{{ stay.name }}</span></nav>
        <a class="back-results" routerLink="/hotels">← Back to results</a>
        <div class="hotel-gallery">
          <button class="gallery-main" type="button" (click)="openGallery(0)"><sw-image [src]="stay.imageUrl" [alt]="stay.imageAlt" [focus]="stay.imageFocus" width="1280" height="850" sizes="(max-width: 767px) 100vw, 65vw" [eager]="true" /></button>
          @for (image of stay.images; track image.url; let i = $index) { <button class="gallery-small" type="button" (click)="openGallery(i + 1)" [attr.aria-label]="'Open image: ' + image.alt"><sw-image [src]="image.url" [alt]="image.alt" width="640" height="420" sizes="(max-width: 767px) 80vw, 25vw" /></button> }
          <div class="gallery-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        </div>
        @if (galleryIndex() !== null) { <div class="lightbox" role="dialog" aria-modal="true" aria-label="Hotel photo gallery" (keydown.escape)="closeGallery()" (keydown.arrowright)="nextGallery(1)" (keydown.arrowleft)="nextGallery(-1)" (keydown.tab)="trapFocus($event)" tabindex="-1">
          <button class="lightbox-close" type="button" (click)="closeGallery()" aria-label="Close gallery">×</button><button type="button" (click)="nextGallery(-1)" aria-label="Previous image">‹</button>
          <sw-image [src]="galleryImages(stay)[galleryIndex() ?? 0].url" [alt]="galleryImages(stay)[galleryIndex() ?? 0].alt" width="1280" height="850" sizes="90vw" />
          <button type="button" (click)="nextGallery(1)" aria-label="Next image">›</button><p>{{ (galleryIndex() ?? 0) + 1 }} / {{ galleryImages(stay).length }} · {{ galleryImages(stay)[galleryIndex() ?? 0].alt }}</p>
        </div> }
        <div class="details-layout">
          <div class="details-main">
            <p class="eyebrow">{{ stay.city }}, {{ stay.state }}</p>
            <div class="title-line"><h1>{{ stay.name }}</h1><span class="rating" [attr.aria-label]="stay.starRating + ' out of 5 stars'">@for (star of stars(stay.starRating); track $index) { <span aria-hidden="true">{{ star ? '★' : '☆' }}</span> }</span></div>
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
              <div><p class="eyebrow">Room type</p><h2 id="room-title">{{ stay.roomTypeName }}</h2><p>{{ roomDescription(stay) }}</p></div>
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
                <p class="rooms" [class.rooms--sold-out]="!availability.available" [class.rooms--low]="availability.available && availability.roomsLeft <= 3">
                  @if (availability.available && availability.roomsLeft <= 3) { Only {{ availability.roomsLeft }} {{ availability.roomsLeft === 1 ? 'room' : 'rooms' }} left }
                  @else if (availability.available) { {{ availability.roomsLeft }} rooms available }
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
  readonly galleryIndex = signal<number | null>(null);
  private galleryOpener: HTMLElement | null = null;

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
  galleryImages(stay: HotelDetail): { url: string; alt: string }[] { return [{ url: stay.imageUrl, alt: stay.imageAlt }, ...stay.images]; }
  openGallery(index: number): void { this.galleryOpener = document.activeElement as HTMLElement; this.galleryIndex.set(index); setTimeout(() => document.querySelector<HTMLElement>('.lightbox button')?.focus()); }
  closeGallery(): void { this.galleryIndex.set(null); setTimeout(() => this.galleryOpener?.focus()); }
  trapFocus(raw: Event): void { const event = raw as KeyboardEvent;const dialog = document.querySelector<HTMLElement>('.lightbox');const nodes=dialog?.querySelectorAll<HTMLElement>('button,[tabindex="0"]');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()} }
  nextGallery(offset: number): void { const count = this.hotel()?.images.length ?? 0; if (count) this.galleryIndex.update((value) => value === null ? 0 : (value + offset + count + 1) % (count + 1)); }
  stars(rating: number): boolean[] { return Array.from({ length: 5 }, (_, index) => index < rating); }
  roomDescription(stay: HotelDetail): string { return stay.amenities.some((item) => item.name === 'Lake views') ? 'A quiet suite with a restful bed and views across the water.' : stay.amenities.some((item) => item.name === 'Work lounge') ? 'A restful room with a thoughtful workspace and city access.' : stay.amenities.some((item) => item.name === 'Heritage architecture') ? 'A calm room with local architectural details and a generous bed.' : 'A restful room with a generous bed and thoughtful local detail.'; }

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
