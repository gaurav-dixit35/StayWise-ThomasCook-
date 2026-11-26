import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <a class="footer__wordmark" routerLink="/">
            <img src="assets/brand/staywise-logo-white.png" width="38" height="38" alt="" />
            <span>StayWise</span>
          </a>
          <p>Thoughtful stays, clear choices, and a helpful next step for every journey.</p>
        </div>
        <nav class="footer__links" aria-label="Footer navigation">
          <a routerLink="/hotels">Explore hotels</a>
          <a routerLink="/manage-booking">Manage a booking</a>
          <a routerLink="/credits">Image credits</a>
        </nav>
        <p class="footer__disclaimer">StayWise is a demonstration project. Hotel names are fictional and images are illustrative.</p>
        <p class="footer__copyright">© 2026 StayWise. Made for journeys across India.</p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
