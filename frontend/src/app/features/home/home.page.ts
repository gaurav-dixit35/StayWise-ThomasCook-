import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HeroSearchComponent } from './hero-search.component';
import { PopularDestinationsComponent } from './popular-destinations.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, HeroSearchComponent, PopularDestinationsComponent],
  template: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__visual">
        <img class="hero__photo" src="assets/destinations/jaipur-courtyard.svg" width="1000" height="900"
             alt="A sandstone Jaipur courtyard framed by gardens and distant hills" fetchpriority="high" />
      </div>
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
    <section class="intro" aria-labelledby="intro-title">
      <div class="intro__copy">
        <p class="eyebrow">A better way forward</p>
        <h2 id="intro-title">When plans change,<br />good choices stay close.</h2>
      </div>
      <p>StayWise brings together considered Indian stays, transparent nightly prices, and useful alternatives when your chosen dates are full.</p>
    </section>
  `,
  styleUrl: './home.page.scss',
})
export class HomePage {}
