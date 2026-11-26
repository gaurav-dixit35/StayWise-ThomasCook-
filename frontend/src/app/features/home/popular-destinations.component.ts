import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { City } from '../../core/models/hotel.model';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { SearchStateService } from '../../core/services/search-state.service';
import { DESTINATIONS } from './destination.config';
import { SwImageComponent } from '../../shared/ui/sw-image/sw-image.component';

const art = DESTINATIONS;

@Component({
  selector: 'app-popular-destinations', standalone: true, imports: [CommonModule, SwImageComponent],
  template: `
    @if (cities().length) {
      <section class="destinations" aria-labelledby="destinations-title">
        <div class="heading"><div><p class="eyebrow">Places worth taking your time</p><h2 id="destinations-title">A few good places to begin</h2></div><p>Eight Indian cities, each with its own rhythm.</p></div>
        <div class="cards">
          @for (city of cities(); track city.name) {
            <button class="destination-card" type="button" (click)="search(city.name)">
              <sw-image [src]="imagePath(city.name)" [alt]="art[city.name]?.alt ?? city.name + ', India'" width="520" height="360" sizes="(max-width: 600px) 82vw, (max-width: 900px) 45vw, 24vw" />
              <span class="destination-card__copy"><small>{{ city.state }}</small><strong>{{ city.name }}</strong><span>{{ art[city.name]?.tagline }}</span></span>
            </button>
          }
        </div>
      </section>
    }
  `,
  styles: `
    :host { display: block; }
    .destinations { width: min(100% - 3rem, 75rem); margin: 0 auto; padding-block: clamp(3.5rem, 7vw, 6rem); }
    .heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 1.5rem; }
    .eyebrow { margin: 0 0 .45rem; color: var(--gold-ink); font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    h2 { max-width: 22ch; margin: 0; color: var(--navy); font: 600 clamp(2rem, 4vw, 3rem)/1.1 'Playfair Display', Georgia, serif; }
    .heading > p { max-width: 22rem; margin: 0; color: var(--ink-muted); line-height: 1.5; }
    .cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .9rem; }
    .destination-card { position: relative; min-height: 19rem; overflow: hidden; padding: 0; border: 0; border-radius: .75rem; background: var(--navy); text-align: left; cursor: pointer; }
    .destination-card::after { position: absolute; inset: 20% 0 0; content: ''; background: linear-gradient(transparent, rgb(10 20 39 / 92%)); }
    .destination-card sw-image { position: absolute; inset: 0; transition: transform 180ms ease; }
    .destination-card:hover sw-image { transform: scale(1.035); }
    .destination-card__copy { position: absolute; z-index: 1; inset: auto 1rem 1rem; display: grid; gap: .2rem; color: white; }
    .destination-card__copy small { color: #f1e2c1; font-size: .82rem; }
    .destination-card__copy strong { font: 600 1.65rem/1.1 'Playfair Display', Georgia, serif; }
    .destination-card__copy > span { font-size: .88rem; line-height: 1.35; }
    @media(max-width: 900px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } .destination-card { min-height: 15rem; } }
    @media(max-width: 600px) { .destinations { width: calc(100% - 2rem); } .heading { align-items: start; flex-direction: column; gap: .8rem; } .cards { gap: .65rem; }.destination-card { min-height: 13rem; }.destination-card__copy { inset-inline: .75rem; bottom: .75rem; }.destination-card__copy strong { font-size: 1.35rem; } }
    @media(max-width: 600px) { .cards { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: .5rem; }.destination-card { flex: 0 0 82%; scroll-snap-align: start; } }
    @media(prefers-reduced-motion: reduce) { .destination-card sw-image { transition: none; } }
  `,
})
export class PopularDestinationsComponent implements OnInit {
  readonly art = art;
  private readonly hotels = inject(HotelApiService);
  private readonly searchState = inject(SearchStateService);
  readonly cities = signal<City[]>([]);
  readonly featuredCities = () => this.cities();
  ngOnInit(): void { this.hotels.getCities().subscribe({ next: (cities) => this.cities.set(cities) }); }
  imagePath(city: string): string { return `assets/images/processed/destinations/${art[city]?.image ?? 'jaipur.jpg'}`; }
  async search(city: string): Promise<void> {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const [year, month, day] = today.split('-').map(Number);
    const start = new Date(year, month - 1, day + 28);
    const end = new Date(year, month - 1, day + 31);
    const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    await this.searchState.search({ city, checkIn: iso(start), checkOut: iso(end) });
  }
}
