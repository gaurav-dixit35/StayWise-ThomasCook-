import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HeroSearchComponent } from './hero-search.component';
import { PopularDestinationsComponent } from './popular-destinations.component';
import { SwImageComponent } from '../../shared/ui/sw-image/sw-image.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, HeroSearchComponent, PopularDestinationsComponent, SwImageComponent],
  template: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__visual"><sw-image class="hero__photo" [src]="'assets/images/processed/hero.jpg'" alt="Amber Fort above Maotha Lake in Jaipur" width="1920" height="1080" sizes="100vw" [eager]="true" /></div>
      <div class="hero__inner">
        <p class="eyebrow">A more considered way to stay</p>
        <h1 id="hero-title">Find a stay that<br /><span>feels right.</span></h1>
        <p class="hero__copy">Thoughtful places across India, with clear prices and a helpful next step at every turn.</p>
        <a class="primary-action" routerLink="/hotels">
          Explore stays <lucide-angular name="arrow-right" [size]="18" aria-hidden="true" />
        </a>
      </div>
    </section>
    <app-hero-search />
    <app-popular-destinations />
    <section class="trust" aria-label="StayWise benefits"><span>Instant confirmation</span><span>Transparent pricing</span><span>Free cancellation before check-in</span><span>Smart alternatives if sold out</span></section>
    <section class="intro" aria-labelledby="intro-title">
      <div class="intro__copy">
        <p class="eyebrow">A better way forward</p>
        <h2 id="intro-title">When plans change,<br />good choices stay close.</h2>
      </div>
      <p>StayWise brings together considered Indian stays, transparent nightly prices, and useful alternatives when your chosen dates are full.</p>
    </section>
    <section class="featured" aria-labelledby="featured-title"><p class="eyebrow">Made for a good night's rest</p><h2 id="featured-title">Featured stays</h2><div class="featured__grid">
      @for (hotel of featured; track hotel.slug) { <a [routerLink]="['/hotels', hotel.slug]"><sw-image [src]="'assets/images/processed/hotels/' + hotel.slug + '-1.jpg'" [alt]="hotel.alt" width="520" height="350" sizes="(max-width: 700px) 85vw, 30vw" /><span>{{ hotel.city }}</span><strong>{{ hotel.name }}</strong></a> }
    </div></section>
  `,
  styleUrl: './home.page.scss',
})
export class HomePage {
  readonly featured = [
    { slug: 'sea-glass-house', name: 'Sea Glass House', city: 'Mumbai', alt: 'Sunlit guest room with a bed, chair and broad window' },
    { slug: 'lakehouse-mewar', name: 'Lakehouse Mewar', city: 'Udaipur', alt: 'Neatly made bed in a modern hotel room' },
    { slug: 'aravali-palace-heritage', name: 'Aravali Palace Heritage', city: 'Jaipur', alt: 'Hotel room with a bed, chair and broad window' },
  ];
}
