import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <header class="header">
      <div class="header__inner">
        <a class="brand" routerLink="/" aria-label="StayWise home" (click)="closeMenu()">
          <span class="brand__mark"><img src="assets/brand/staywise-logo.png" alt="" width="42" height="42" /></span>
          <span class="brand__word"><span>Stay</span><span>Wise</span></span>
        </a>
        <button class="menu-toggle" type="button" [attr.aria-expanded]="menuOpen()"
                aria-controls="primary-navigation" [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
                (click)="toggleMenu()">
          <lucide-angular [name]="menuOpen() ? 'x' : 'menu'" [size]="22" aria-hidden="true" />
        </button>
        <nav id="primary-navigation" class="navigation" [class.navigation--open]="menuOpen()"
             aria-label="Main navigation">
          <a routerLink="/hotels" routerLinkActive="navigation__link--active" (click)="closeMenu()">Hotels</a>
          <a routerLink="/manage-booking" routerLinkActive="navigation__link--active" (click)="closeMenu()">Manage booking</a>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
