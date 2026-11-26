import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<span class="skeleton" [style.width]="width()" [style.height]="height()" aria-hidden="true"></span>`,
  host: { role: 'status', '[attr.aria-label]': 'label()' },
  styles: `
    :host { display: block; }
    .skeleton { display: block; border-radius: .45rem; background: #e9e7e1; animation: shimmer 1.5s ease-in-out infinite alternate; }
    @keyframes shimmer { to { opacity: .55; } }
    @media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
  `,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly label = input('Loading content');
}
