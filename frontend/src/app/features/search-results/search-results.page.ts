import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelSummary } from '../../core/models/hotel.model';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { SearchStateService } from '../../core/services/search-state.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { NightsPipe } from '../../shared/pipes/nights.pipe';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { SmartAlternativesComponent } from '../../shared/ui/smart-alternatives/smart-alternatives.component';
import { HeroSearchComponent } from '../home/hero-search.component';
import { SwImageComponent } from '../../shared/ui/sw-image/sw-image.component';

type HotelSort = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

@Component({
  selector: 'app-search-results-page',
  standalone: true,
  imports: [CommonModule, RouterLink, InrPipe, NightsPipe, BadgeComponent, ButtonComponent, HeroSearchComponent, SmartAlternativesComponent, SwImageComponent],
  template: `
    <section class="results-page" aria-labelledby="results-title">
      <div class="results-search"><app-hero-search [compact]="true" /></div>
      <div class="results-layout">
        <aside class="filters" aria-label="Filter hotel results">
          <div class="filters__heading"><h2>Refine your search</h2><button type="button" (click)="clearFilters()">Clear</button></div>
          <fieldset><legend>Amenities</legend>
            @for (amenity of amenityOptions(); track amenity) {
              <label><input type="checkbox" [checked]="selectedAmenities().includes(amenity)" (change)="toggleAmenity(amenity)" /> {{ amenity }}</label>
            }
          </fieldset>
        </aside>
        <div class="results-content">
          <div class="results-heading">
            <div><p class="eyebrow">StayWise collection</p><h1 id="results-title">{{ heading() }}</h1>
              <p class="results-count">{{ filteredHotels().length }} stays to explore@if (criteria().checkIn && criteria().checkOut) { · {{ criteria().checkIn | date:'d MMM' }} – {{ criteria().checkOut | date:'d MMM yyyy' }} · {{ nights() | nights }} }</p></div>
            <label class="sort-control">Sort by
              <select [value]="sort()" (change)="setSort($event)">
                <option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option><option value="rating">Guest rating</option>
              </select>
            </label>
          </div>
          <button class="mobile-filter-trigger" type="button" (click)="filterOpen.set(true)">Filter amenities@if (selectedAmenities().length) { · {{ selectedAmenities().length }} selected }</button>
          @if (filterOpen()) { <div class="filter-backdrop" (click)="filterOpen.set(false)"><aside class="filter-drawer" aria-label="Filter hotel results" (click)="$event.stopPropagation()"><button type="button" (click)="filterOpen.set(false)">Close filters</button>@for (amenity of amenityOptions(); track amenity) { <label><input type="checkbox" [checked]="selectedAmenities().includes(amenity)" (change)="toggleAmenity(amenity)" /> {{ amenity }}</label> }</aside></div> }
          @if (loading() && !hotels().length) {
            <div class="skeleton-list" role="status" aria-label="Loading hotel results">
              @for (item of [1, 2, 3]; track item) { <div class="skeleton-card"><span></span><div><i></i><i></i><i></i></div><b></b></div> }
            </div>
          } @else if (loading()) {
            <p class="refreshing" role="status">Updating stays for your dates…</p>
          } @else if (error()) {
            <div class="empty-state" role="alert"><h2>We could not load these stays.</h2><p>{{ error() }}</p><app-button variant="secondary" (click)="load()">Try again</app-button></div>
          } @else if (filteredHotels().length) {
            <div class="hotel-list">
              @for (hotel of filteredHotels(); track hotel.id) {
                <article class="hotel-card">
                  <a class="hotel-card__image" [routerLink]="['/hotels', hotel.slug]" [queryParams]="queryParams()">
                    <sw-image [src]="hotel.imageUrl" [alt]="hotel.imageAlt" [focus]="hotel.imageFocus" width="340" height="240" sizes="(max-width: 767px) 40vw, 340px" />
                  </a>
                  <div class="hotel-card__body">
                    <div class="hotel-card__top"><div><p class="location">{{ hotel.city }}, {{ hotel.state }}</p>
                      <h2><a [routerLink]="['/hotels', hotel.slug]" [queryParams]="queryParams()">{{ hotel.name }}</a></h2></div>
                      <span class="rating" [attr.aria-label]="hotel.starRating + ' out of 5 stars'">{{ hotel.starRating }} <span aria-hidden="true">★</span></span></div>
                    <p class="description">{{ hotel.description }}</p>
                    <div class="amenities" aria-label="Amenities">
                      @for (amenity of hotel.amenities.slice(0, 4); track amenity.iconKey) { <span>{{ amenity.name }}</span> }
                      @if (hotel.amenities.length > 4) { <span>+{{ hotel.amenities.length - 4 }} more</span> }
                    </div>
                    @if (hotel.availability; as availability) { @if (availability.available && availability.roomsLeft <= 3) { <app-badge tone="warning">Only {{ availability.roomsLeft }} rooms left</app-badge> } }
                  </div>
                  <div class="hotel-card__price">
                    @if (criteria().checkIn && hotel.availability?.available) { <p class="price-label">Total for {{ hotel.availability?.nights }} {{ hotel.availability?.nights === 1 ? 'night' : 'nights' }}</p><strong>{{ hotel.availability?.totalAmount | inr }}</strong><p class="nightly">{{ hotel.pricePerNight | inr }} per night</p> }
                    @else { <p class="price-label">From per night</p><strong class="price-muted">{{ hotel.pricePerNight | inr }}</strong> }
                    @if (hotel.availability?.available === false && criteria().checkIn) { <span class="sold-status">Sold out</span><a class="view-button view-button--secondary" [routerLink]="['/hotels', hotel.slug]" [queryParams]="queryParams()">See alternatives</a> }
                    @else { <a class="view-button" [routerLink]="['/hotels', hotel.slug]" [queryParams]="queryParams()">View stay</a> }
                  </div>
                  @if (criteria().checkIn && hotel.availability?.available === false) { <app-smart-alternatives class="card-alternatives" [hotelId]="hotel.id" [checkIn]="criteria().checkIn" [checkOut]="criteria().checkOut" [excludeHotelIds]="visibleAvailableIds()" /> }
                </article>
              }
            </div>
          } @else {
            <div class="empty-state"><h2>No stays found. Try another city.</h2><p>Change your destination or dates to see more options.</p><a routerLink="/">Change search</a></div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './search-results.page.scss',
})
export class SearchResultsPage implements OnInit {
  private readonly api = inject(HotelApiService);
  private readonly route = inject(ActivatedRoute);
  readonly searchState = inject(SearchStateService);
  readonly criteria = this.searchState.criteria;
  readonly hotels = signal<HotelSummary[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly sort = signal<HotelSort>('recommended');
  readonly selectedAmenities = signal<string[]>([]);
  readonly filterOpen = signal(false);
  readonly nights = computed(() => this.criteria().checkIn && this.criteria().checkOut
    ? this.hotels()[0]?.availability?.nights ?? 0 : 0);
  readonly heading = computed(() => this.criteria().city ? `Stays in ${this.criteria().city}` : 'Find a stay that feels right');
  readonly amenityOptions = computed(() => [...new Set(this.hotels().flatMap((hotel) => hotel.amenities.map((amenity) => amenity.name)))].sort());
  readonly filteredHotels = computed(() => {
    const selected = this.selectedAmenities();
    const results = this.hotels().filter((hotel) => selected.every((name) => hotel.amenities.some((amenity) => amenity.name === name)));
    const sort = this.sort();
    return [...results].sort((first, second) => {
      if (sort === 'recommended' && Number(second.availability?.available) !== Number(first.availability?.available)) return Number(second.availability?.available) - Number(first.availability?.available);
      if (sort === 'price-asc') return first.pricePerNight - second.pricePerNight;
      if (sort === 'price-desc') return second.pricePerNight - first.pricePerNight;
      if (sort === 'rating') return second.starRating - first.starRating || first.pricePerNight - second.pricePerNight;
      return second.starRating - first.starRating || first.pricePerNight - second.pricePerNight;
    });
  });
  readonly visibleAvailableIds = computed(() => this.filteredHotels().filter((hotel) => hotel.availability?.available).map((hotel) => hotel.id));

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(() => {
      this.selectedAmenities.set([]);
      this.sort.set('recommended');
      this.load();
    });
  }

  load(): void {
    const criteria = this.criteria();
    this.loading.set(true);
    this.error.set('');
    if (!criteria.checkIn || !criteria.checkOut) {
      this.hotels.set([]);
      this.loading.set(false);
      this.error.set('Choose check-in and check-out dates to search.');
      return;
    }
    this.api.search(criteria.city || undefined, criteria.checkIn || undefined, criteria.checkOut || undefined).subscribe({
      next: (items) => this.hotels.set(items),
      error: () => { this.error.set('Please check the search details and try again.'); this.loading.set(false); },
      complete: () => this.loading.set(false),
    });
  }

  setSort(event: Event): void { this.sort.set((event.target as HTMLSelectElement).value as HotelSort); }
  toggleAmenity(name: string): void {
    this.selectedAmenities.update((selected) => selected.includes(name) ? selected.filter((item) => item !== name) : [...selected, name]);
  }
  clearFilters(): void { this.selectedAmenities.set([]); this.sort.set('recommended'); }
  queryParams(): Record<string, string> {
    const { checkIn, checkOut } = this.criteria();
    return checkIn && checkOut ? { checkIn, checkOut } : {};
  }
}
