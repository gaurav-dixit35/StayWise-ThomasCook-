import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingApiService } from '../../core/services/booking-api.service';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { HotelDetail, PriceBreakdown } from '../../core/models/hotel.model';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { NightsPipe } from '../../shared/pipes/nights.pipe';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { SmartAlternativesComponent } from '../../shared/ui/smart-alternatives/smart-alternatives.component';
import { SwImageComponent } from '../../shared/ui/sw-image/sw-image.component';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InrPipe, NightsPipe,
    BadgeComponent, ButtonComponent, SmartAlternativesComponent, SwImageComponent],
  template: `
    @if (loading()) {
      <div class="booking-status" role="status">Preparing your reservation…</div>
    } @else if (!hotel() || (!quote() && !soldOut())) {
      <div class="booking-status" role="alert"><h1>We could not prepare this reservation.</h1><p>{{ loadError() }}</p><a routerLink="/hotels">Explore other stays</a></div>
    } @else {
      <section class="booking-page" aria-labelledby="booking-title">
        <div class="booking-heading"><p class="eyebrow">One more step</p><h1 id="booking-title">Complete your reservation</h1><p>Your price is confirmed by StayWise before you book.</p></div>
        @if (soldOut()) {
          <div class="soldout-message" role="status"><h2>Those dates just sold out.</h2><p>Here are some options that are still available.</p></div>
          <app-smart-alternatives [hotelId]="hotel()!.id" [checkIn]="checkIn()" [checkOut]="checkOut()" />
        } @else {
          <div class="booking-grid">
            <form class="guest-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <h2>Who is staying?</h2>
              <p>Use the name and email you will use to manage this booking later.</p>
              <label for="guest-name">Full name</label>
              <input id="guest-name" type="text" formControlName="guestName" autocomplete="name" maxlength="120"
                     [attr.aria-invalid]="showError('guestName')" [attr.aria-describedby]="showError('guestName') ? 'guest-name-error' : null" (blur)="markTouched('guestName')" />
              @if (showError('guestName')) { <span class="field-error" id="guest-name-error">{{ fieldError('guestName') }}</span> }
              <label for="guest-email">Email address</label>
              <input id="guest-email" type="email" formControlName="guestEmail" autocomplete="email" maxlength="190"
                     [attr.aria-invalid]="showError('guestEmail')" [attr.aria-describedby]="showError('guestEmail') ? 'guest-email-error' : null" (blur)="markTouched('guestEmail')" />
              @if (showError('guestEmail')) { <span class="field-error" id="guest-email-error">{{ fieldError('guestEmail') }}</span> }
              @if (submitError()) { <p class="form-error" role="alert">{{ submitError() }}</p> }
              <app-button type="submit" [fullWidth]="true" [loading]="submitting()">Confirm booking</app-button>
              <p class="form-note">By confirming, you agree to the stay dates shown in your summary. No payment is collected.</p>
            </form>
            <aside class="summary-card" aria-labelledby="summary-title">
              <sw-image [src]="hotel()!.imageUrl" [alt]="hotel()!.imageAlt" [focus]="hotel()!.imageFocus" width="560" height="320" sizes="560px" />
              <div class="summary-card__content">
                <p class="eyebrow">Your stay</p><h2 id="summary-title">{{ hotel()!.name }}</h2>
                <p>{{ hotel()!.city }}, {{ hotel()!.state }} · {{ hotel()!.roomTypeName }}</p>
                <div class="dates"><span><small>Check-in</small><strong>{{ checkIn() | date:'EEE, d MMM yyyy' }}</strong></span>
                  <span><small>Check-out</small><strong>{{ checkOut() | date:'EEE, d MMM yyyy' }}</strong></span></div>
                @if (hotel()!.availability; as availability) {
                @if (availability.available && availability.roomsLeft <= 3) {
                  <app-badge tone="warning">Only {{ hotel()!.availability!.roomsLeft }} {{ hotel()!.availability!.roomsLeft === 1 ? 'room' : 'rooms' }} left</app-badge>
                }
                }
                @if (quote(); as price) {
                <div class="price-breakdown">
                  <div><span>{{ price.pricePerNight | inr }} × {{ price.nights | nights }}</span><strong>{{ price.subtotal | inr }}</strong></div>
                  <div class="price-breakdown__total"><span>Total · no added fees</span><strong>{{ price.total | inr }}</strong></div>
                </div>
                }
              </div>
            </aside>
          </div>
        }
      </section>
    }
  `,
  styleUrl: './booking.page.scss',
})
export class BookingPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hotelApi = inject(HotelApiService);
  private readonly bookingApi = inject(BookingApiService);
  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.nonNullable.group({
    guestName: ['', [Validators.required, Validators.maxLength(120)]],
    guestEmail: ['', [Validators.required, Validators.email, Validators.maxLength(190)]],
  });
  readonly hotel = signal<HotelDetail | null>(null);
  readonly quote = signal<PriceBreakdown | null>(null);
  readonly checkIn = signal('');
  readonly checkOut = signal('');
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly soldOut = signal(false);
  readonly submitError = signal('');
  readonly loadError = signal('');
  readonly fieldErrors = signal<Record<string, string>>({});
  private submitted = false;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('id') ?? '';
    this.checkIn.set(this.route.snapshot.queryParamMap.get('checkIn') ?? '');
    this.checkOut.set(this.route.snapshot.queryParamMap.get('checkOut') ?? '');
    if (!slug || !this.checkIn() || !this.checkOut()) {
      this.loadError.set('Choose your dates from the hotel details page before continuing.');
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.hotelApi.getHotelBySlug(slug, this.checkIn(), this.checkOut()).subscribe({
      next: (hotel) => {
        this.hotel.set(hotel);
        if (hotel.availability?.available === false) this.soldOut.set(true);
      },
      error: () => { this.loadError.set('Return to the hotel list and choose another stay.'); this.loading.set(false); },
      complete: () => {
        const hotelId = this.hotel()?.id;
        if (hotelId && !this.soldOut()) this.hotelApi.quote(hotelId, this.checkIn(), this.checkOut()).subscribe({
          next: (quote) => this.quote.set(quote),
          error: () => this.loadError.set('We could not calculate the stay price. Please try again.'),
          complete: () => this.loading.set(false),
        });
        else this.loading.set(false);
      },
    });
  }

  showError(field: 'guestName' | 'guestEmail'): boolean {
    const control = this.form.controls[field];
    return (control.touched || this.submitted) && (control.invalid || !!this.fieldErrors()[field]);
  }

  fieldError(field: 'guestName' | 'guestEmail'): string {
    const serverMessage = this.fieldErrors()[field];
    if (serverMessage) return serverMessage;
    const control = this.form.controls[field];
    if (control.hasError('required')) return field === 'guestName' ? 'Enter your full name.' : 'Enter your email address.';
    if (control.hasError('email')) return 'Enter a valid email address.';
    if (control.hasError('maxlength')) return 'This value is too long.';
    return 'Check this value.';
  }

  markTouched(field: 'guestName' | 'guestEmail'): void { this.form.controls[field].markAsTouched(); }

  submit(): void {
    this.submitted = true;
    this.submitError.set('');
    this.fieldErrors.set({});
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const hotel = this.hotel();
    if (!hotel) return;
    const values = this.form.getRawValue();
    this.submitting.set(true);
    this.bookingApi.create({
      hotelId: hotel.id,
      guestName: values.guestName.trim(),
      guestEmail: values.guestEmail.trim(),
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
    }).subscribe({
      next: (booking) => void this.router.navigate(['/booking/confirmation', booking.reference], { state: { booking } }),
      error: (error: unknown) => {
        this.submitting.set(false);
        if (error instanceof HttpErrorResponse) {
          const body = error.error as { code?: string; fieldErrors?: { field: string; message: string }[] };
          if (body.code === 'SOLD_OUT') this.soldOut.set(true);
          this.fieldErrors.set(Object.fromEntries((body.fieldErrors ?? []).map((field) => [field.field, field.message])));
          if (body.code !== 'SOLD_OUT' && !body.fieldErrors?.length) this.submitError.set(body.code === 'DATE_IN_PAST' ? 'Check-in has already passed. Return to the hotel details and choose new dates.' : body.code === 'DATES_OUT_OF_RANGE' ? 'These dates are no longer available to book. Choose dates within the next year.' : body.code === 'CANCELLATION_NOT_ALLOWED' ? 'Check-in has started, so this booking cannot be created. Return to the hotel details and choose new dates.' : body.code === 'INVALID_DATE_RANGE' ? 'Check-out must be later than check-in. Return to choose new dates.' : 'We could not confirm this booking. Please review your details and try again.');
        } else this.submitError.set('We could not confirm this booking. Please try again.');
      },
      complete: () => this.submitting.set(false),
    });
  }

}
