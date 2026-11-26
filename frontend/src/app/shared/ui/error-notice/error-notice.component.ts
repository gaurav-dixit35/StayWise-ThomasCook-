import { Component, inject } from '@angular/core';
import { ErrorNoticeService } from '../../../core/services/error-notice.service';

@Component({
  selector: 'app-error-notice',
  standalone: true,
  template: `
    @if (notices.message(); as message) {
      <div class="notice" role="alert" aria-live="assertive">
        <p>{{ message }}</p>
        <button type="button" aria-label="Dismiss message" (click)="notices.dismiss()">Dismiss</button>
      </div>
    }
  `,
  styles: `
    .notice { position: fixed; z-index: 1000; inset: 1rem 1rem auto auto; display: flex; align-items: center; gap: 1rem; max-width: min(32rem, calc(100vw - 2rem)); padding: .9rem 1rem; border: 1px solid #bd7167; border-radius: .75rem; background: #fff8f6; color: #572720; box-shadow: 0 .5rem 1.5rem rgb(23 36 61 / 14%); }
    p { margin: 0; }
    button { min-height: 2.75rem; border: 0; background: transparent; color: inherit; font-weight: 700; cursor: pointer; }
  `,
})
export class ErrorNoticeComponent {
  readonly notices = inject(ErrorNoticeService);
}
