import { Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type()" [disabled]="disabled() || loading()" [class]="'button button--' + variant()"
            [class.button--full]="fullWidth()"
            [attr.aria-busy]="loading() ? 'true' : null">
      @if (loading()) { <span class="spinner" aria-hidden="true"></span> }
      <ng-content />
    </button>
  `,
  styles: `
    :host { display: inline-flex; }
    .button { min-height: 3rem; display: inline-flex; align-items: center; justify-content: center; gap: .6rem; padding: .7rem 1.1rem; border: 1px solid transparent; border-radius: .5rem; font: inherit; font-weight: 700; cursor: pointer; transition: background 160ms ease, border-color 160ms ease, transform 160ms ease; }
    .button:hover:not(:disabled) { transform: translateY(-1px); }
    .button:disabled { cursor: not-allowed; opacity: .58; }
    .button--primary { background: var(--navy); color: white; }
    .button--primary:hover:not(:disabled) { background: var(--navy-deep); }
    .button--secondary { border-color: var(--navy); background: white; color: var(--navy); }
    .button--secondary:hover:not(:disabled) { background: #f2f4f7; }
    .button--quiet { background: transparent; color: var(--navy); }
    .button--full { width: 100%; }
    .spinner { width: 1rem; height: 1rem; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 2s; } }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);
}
