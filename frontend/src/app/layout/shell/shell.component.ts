import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorNoticeComponent } from '../../shared/ui/error-notice/error-notice.component';
import { LoadingService } from '../../core/services/loading.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ErrorNoticeComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <app-header />
    @if (loading.isLoading()) {
      <div class="loading-indicator" role="progressbar" aria-label="Loading page content"></div>
    }
    <main id="main-content" class="main-content" [attr.aria-busy]="loading.isLoading()">
      <router-outlet />
    </main>
    <app-footer />
    <app-error-notice />
  `,
  styles: `
    :host { display: flex; min-height: 100vh; flex-direction: column; }
    .main-content { flex: 1; }
    .skip-link { position: fixed; z-index: 100; top: .5rem; left: .5rem; transform: translateY(-160%); padding: .75rem 1rem; border-radius: .4rem; background: white; color: var(--navy); font-weight: 700; box-shadow: 0 .3rem 1rem rgb(0 0 0 / 16%); }
    .skip-link:focus { transform: translateY(0); }
    .loading-indicator { position: fixed; z-index: 100; inset: 0 0 auto; height: 3px; background: var(--gold); transform-origin: left; animation: progress 1.1s ease-in-out infinite alternate; }
    @keyframes progress { from { transform: scaleX(.15); } to { transform: scaleX(.8); } }
    @media (prefers-reduced-motion: reduce) { .loading-indicator { animation: none; } }
  `,
})
export class ShellComponent {
  readonly loading = inject(LoadingService);
}
