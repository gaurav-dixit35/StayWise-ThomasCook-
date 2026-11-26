import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'gold' | 'success' | 'warning';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="'badge badge--' + tone()"><ng-content /></span>`,
  styles: `
    :host { display: inline-flex; }
    .badge { min-height: 1.75rem; display: inline-flex; align-items: center; padding: .25rem .55rem; border: 1px solid transparent; border-radius: .45rem; font-size: .82rem; font-weight: 700; line-height: 1.2; }
    .badge--neutral { border-color: var(--line); background: #f7f6f3; color: #414752; }
    .badge--gold { border-color: #dac9a7; background: #f6f0e4; color: #654b21; }
    .badge--success { border-color: #bad7c5; background: #edf7f0; color: #215b38; }
    .badge--warning { border-color: #e8c6a4; background: #fff4e9; color: #704419; }
  `,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
