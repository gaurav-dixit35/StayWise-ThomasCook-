import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Booking } from '../../core/models/booking.model';
import { InrPipe } from '../../shared/pipes/inr.pipe';

  @Component({
  selector: 'app-confirmation-page', standalone: true, imports: [CommonModule, RouterLink, InrPipe],
  template: `
    <section class="confirmation" aria-labelledby="confirmation-title">
      <div class="confirmation__mark" aria-hidden="true"><span></span></div>
      <p class="eyebrow">Reservation received</p><h1 id="confirmation-title">{{ booking() ? 'Your stay is confirmed.' : 'Your booking details' }}</h1>
      @if (booking(); as stay) {
        <p class="intro">We have saved your stay, {{ stay.guestName }}. Keep this reference for your records.</p>
        <div class="reference"><span>Booking reference</span><strong>{{ stay.reference }}</strong><button type="button" (click)="copyReference(stay.reference)">{{ copied() ? 'Copied' : 'Copy reference' }}</button></div>
        <dl class="details">
          <div><dt>Hotel</dt><dd>{{ stay.hotel.name }}</dd></div><div><dt>Destination</dt><dd>{{ stay.hotel.city }}, {{ stay.hotel.state }}</dd></div>
          <div><dt>Check-in</dt><dd>{{ stay.checkIn | date:'EEE, d MMM yyyy' }}</dd></div><div><dt>Check-out</dt><dd>{{ stay.checkOut | date:'EEE, d MMM yyyy' }}</dd></div>
          <div><dt>Guest</dt><dd>{{ stay.guestName }}</dd></div><div><dt>Status</dt><dd>{{ stay.status === 'CONFIRMED' ? 'Confirmed' : 'Cancelled' }}</dd></div>
          <div class="details__total"><dt>Total · {{ stay.nights }} {{ stay.nights === 1 ? 'night' : 'nights' }}</dt><dd>{{ stay.totalAmount | inr }}</dd></div>
        </dl>
        <p class="email-note">Keep this reference with the email you used when booking. Enter both on Manage booking to find or cancel your reservation.</p>
        <div class="actions"><button type="button" class="secondary" (click)="print()">Print confirmation</button><a class="primary" [routerLink]="['/manage-booking']" [queryParams]="{ reference: stay.reference }">Manage booking</a><a class="secondary" routerLink="/">Back to StayWise</a></div>
      } @else { <p role="alert">{{ error() }}</p><a [routerLink]="['/manage-booking']" [queryParams]="{ reference: reference }">Look up booking</a> }
    </section>
  `,
  styleUrl: './confirmation.page.scss',
})
export class ConfirmationPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly booking = signal<Booking | null>(null);
  readonly error = signal('');
  readonly copied = signal(false);
  reference = '';
  ngOnInit(): void {
    const reference = this.route.snapshot.paramMap.get('reference') ?? '';
    this.reference = reference;
    const stateBooking = history.state?.booking as Booking | undefined;
    if (stateBooking?.reference === reference) { this.booking.set(stateBooking); return; }
    this.error.set('Confirmation details are available immediately after booking. To look them up later, enter the booking reference and email on Manage booking.');
  }
  async copyReference(reference: string): Promise<void> {
    try { await navigator.clipboard.writeText(reference); this.copied.set(true); }
    catch { this.error.set('Select and copy the booking reference manually.'); }
  }
  print(): void { window.print(); }
}
