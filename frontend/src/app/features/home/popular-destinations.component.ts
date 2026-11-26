import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { City } from '../../core/models/hotel.model';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { SearchStateService } from '../../core/services/search-state.service';

const art: Record<string, { title: string; image: string; line: string }> = {
  Jaipur: { title: 'Pink city mornings', image: 'assets/destinations/jaipur-courtyard.svg', line: 'Heritage courtyards and garden hideaways' },
  Goa: { title: 'A slower shore', image: 'assets/hotels/sea-glass-house.svg', line: 'Coastal calm with room to unwind' },
  Kochi: { title: 'Harbour stories', image: 'assets/hotels/backwater-still.svg', line: 'Old harbour lanes and backwater ease' },
  Udaipur: { title: 'Lakeside pauses', image: 'assets/hotels/lakehouse-mewar.svg', line: 'Quiet views beside the water' },
};

@Component({
  selector: 'app-popular-destinations', standalone: true, imports: [CommonModule],
  template: `
    @if (cities().length) {
      <section class="destinations" aria-labelledby="destinations-title">
        <div class="heading"><div><p class="eyebrow">Places worth taking your time</p><h2 id="destinations-title">A few good places to begin</h2></div><p>Discover a handful of India's eight destination cities.</p></div>
        <div class="cards">
          @for (city of featuredCities(); track city.name) {
            <button class="destination-card" type="button" (click)="search(city.name)">
              <img [src]="artwork(city.name).image" [alt]="''" width="520" height="360" loading="lazy" />
              <span class="destination-card__copy"><small>{{ city.state }}</small><strong>{{ city.name }}</strong><span>{{ artwork(city.name).line }}</span></span>
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
    .destination-card::after { position: absolute; inset: 35% 0 0; content: ''; background: linear-gradient(transparent, rgb(15 25 43 / 82%)); }
    .destination-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 180ms ease; }
    .destination-card:hover img { transform: scale(1.035); }
    .destination-card__copy { position: absolute; z-index: 1; inset: auto 1rem 1rem; display: grid; gap: .2rem; color: white; }
    .destination-card__copy small { color: #f1e2c1; font-size: .78rem; }
    .destination-card__copy strong { font: 600 1.65rem/1.1 'Playfair Display', Georgia, serif; }
    .destination-card__copy > span { font-size: .88rem; line-height: 1.35; }
    @media(max-width: 900px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } .destination-card { min-height: 15rem; } }
    @media(max-width: 600px) { .destinations { width: calc(100% - 2rem); } .heading { align-items: start; flex-direction: column; gap: .8rem; } .cards { gap: .65rem; }.destination-card { min-height: 13rem; }.destination-card__copy { inset-inline: .75rem; bottom: .75rem; }.destination-card__copy strong { font-size: 1.35rem; } }
    @media(prefers-reduced-motion: reduce) { .destination-card img { transition: none; } }
  `,
})
export class PopularDestinationsComponent implements OnInit {
  private readonly hotels = inject(HotelApiService);
  private readonly searchState = inject(SearchStateService);
  readonly cities = signal<City[]>([]);
  readonly featuredCities = () => this.cities().filter((city) => art[city.name]);
  ngOnInit(): void { this.hotels.getCities().subscribe({ next: (cities) => this.cities.set(cities) }); }
  artwork(city: string): { title: string; image: string; line: string } { return art[city] ?? art['Jaipur']; }
  async search(city: string): Promise<void> {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const [year, month, day] = today.split('-').map(Number);
    const start = new Date(year, month - 1, day + 28);
    const end = new Date(year, month - 1, day + 31);
    const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    await this.searchState.search({ city, checkIn: iso(start), checkOut: iso(end) });
  }
}
