import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section-intro',
  standalone: true,
  template: `
    <section class="section" aria-labelledby="section-title">
      <p class="eyebrow">StayWise</p>
      <h1 id="section-title">{{ title }}</h1>
      <p class="section__copy">{{ description }}</p>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 30rem; }
    .section { width: min(100% - 3rem, 75rem); margin-inline: auto; padding-block: clamp(4rem, 9vw, 8rem); }
    .eyebrow { color: var(--gold-ink); font-size: .82rem; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }
    h1 { max-width: 15ch; margin: 0; color: var(--navy); font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.6rem, 6vw, 5rem); line-height: 1.08; }
    .section__copy { max-width: 38rem; margin-top: 1.25rem; color: var(--ink-muted); font-size: 1.15rem; line-height: 1.6; }
    @media (max-width: 480px) { .section { width: calc(100% - 2rem); } }
  `,
})
export class SectionIntroComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] as string;
  readonly description = this.route.snapshot.data['description'] as string;
}
