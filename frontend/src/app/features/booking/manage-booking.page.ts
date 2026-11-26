import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../core/models/booking.model';
import { BookingApiService } from '../../core/services/booking-api.service';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-manage-booking-page', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InrPipe, ButtonComponent],
  template: `
    <section class="manage-page" aria-labelledby="manage-title">
      <div class="manage-heading"><p class="eyebrow">Your reservation</p><h1 id="manage-title">Manage your booking</h1><p>Enter the booking reference and the email used at reservation.</p></div>
      <form class="lookup-form" [formGroup]="form" (ngSubmit)="lookup()" novalidate>
        <label for="reference">Booking reference</label><input id="reference" formControlName="reference" autocomplete="off" placeholder="SW-XXXXXXXX" maxlength="11" required [attr.aria-invalid]="form.controls.reference.touched && form.controls.reference.invalid" aria-describedby="reference-help" (blur)="form.controls.reference.markAsTouched()" />
        <span id="reference-help" class="input-help">Your 11-character reference starts with SW-.</span>
        <label for="email">Booking email</label><input id="email" type="email" formControlName="email" autocomplete="email" required [attr.aria-invalid]="form.controls.email.touched && form.controls.email.invalid" aria-describedby="email-help" (blur)="form.controls.email.markAsTouched()" />
        <span id="email-help" class="visually-hidden">Enter the email used to make this booking.</span>
        @if (formError()) { <p class="form-error" role="alert">{{ formError() }}</p> }
        <app-button type="submit" [loading]="loading()">Find booking</app-button>
      </form>
      @if (booking(); as stay) {
        <article class="booking-card" aria-live="polite">
          <div class="booking-card__top"><div><p class="eyebrow">{{ stay.reference }}</p><h2>{{ stay.hotel.name }}</h2><p>{{ stay.hotel.city }}, {{ stay.hotel.state }}</p></div>
            <span class="status" [class.status--cancelled]="stay.status === 'CANCELLED'">{{ stay.status === 'CONFIRMED' ? 'Confirmed' : 'Cancelled' }}</span></div>
          <dl><div><dt>Guest</dt><dd>{{ stay.guestName }}</dd></div><div><dt>Check-in</dt><dd>{{ stay.checkIn | date:'EEE, d MMM yyyy' }}</dd></div>
            <div><dt>Check-out</dt><dd>{{ stay.checkOut | date:'EEE, d MMM yyyy' }}</dd></div><div><dt>Total</dt><dd>{{ stay.totalAmount | inr }}</dd></div></dl>
          @if (stay.status === 'CONFIRMED') {
            @if (canCancel()) { <button class="cancel-button" type="button" (click)="openCancelDialog()">Cancel booking</button> }
            @else { <p class="cancel-note">The cancellation deadline has passed. This confirmed reservation cannot be cancelled online.</p> }
          }
        </article>
      }
      <dialog #cancelDialog class="cancel-dialog" aria-labelledby="cancel-title" (close)="dialogClosed()" (cancel)="onDialogCancel($event)">
        <p class="eyebrow">Please confirm</p><h2 id="cancel-title">Cancel this booking?</h2>
        <p>This will release the reserved room for these dates. This action cannot be undone.</p>
        @if (cancelError()) { <p class="form-error" role="alert">{{ cancelError() }}</p> }
        <div class="dialog-actions"><button type="button" class="secondary" (click)="closeCancelDialog()">Keep booking</button>
          <button type="button" class="danger" [disabled]="cancelling()" (click)="cancel()">{{ cancelling() ? 'Cancelling…' : 'Confirm cancellation' }}</button></div>
      </dialog>
    </section>
  `,
  styleUrl: './manage-booking.page.scss',
})
export class ManageBookingPage implements OnInit {
  private readonly api = inject(BookingApiService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  @ViewChild('cancelDialog') cancelDialogRef?: ElementRef<HTMLDialogElement>;
  readonly form = this.fb.nonNullable.group({ reference: ['', [Validators.required, Validators.pattern(/^SW-[A-Z2-9]{8}$/), Validators.maxLength(11)]], email: ['', [Validators.required, Validators.email, Validators.maxLength(190)]] });
  readonly booking = signal<Booking | null>(null);
  readonly loading = signal(false);
  readonly cancelling = signal(false);
  readonly formError = signal('');
  readonly cancelError = signal('');

  ngOnInit(): void {
    const reference = this.route.snapshot.queryParamMap.get('reference');
    const email = this.route.snapshot.queryParamMap.get('email');
    if (reference && email) { this.form.setValue({ reference, email }); }
  }
  canCancel(): boolean { const booking = this.booking(); return !!booking && booking.status === 'CONFIRMED' && booking.checkIn > this.todayInIndia(); }
  lookup(): void {
    this.formError.set(''); this.booking.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); this.formError.set('Enter an 11-character reference in the format SW-XXXXXXXX and a valid booking email.'); return; }
    const value = this.form.getRawValue(); this.loading.set(true);
    this.api.lookup({ reference: value.reference.trim().toUpperCase(), email: value.email.trim() }).subscribe({
      next: (booking) => this.booking.set(booking),
      error: (error: unknown) => {
        const code = error instanceof HttpErrorResponse ? (error.error as { code?: string })?.code : '';
        this.formError.set(code === 'BOOKING_NOT_FOUND' ? 'We could not find a booking with those details. Check the reference and email.' : 'We could not look up the booking. Please try again.');
        this.loading.set(false);
      }, complete: () => this.loading.set(false),
    });
  }
  openCancelDialog(): void { this.cancelError.set(''); this.cancelDialogRef?.nativeElement.showModal(); }
  closeCancelDialog(): void { this.cancelDialogRef?.nativeElement.close(); }
  onDialogCancel(event: Event): void { if (this.cancelling()) event.preventDefault(); }
  dialogClosed(): void { if (!this.cancelling()) this.cancelError.set(''); }
  cancel(): void {
    const booking = this.booking(); if (!booking || !this.canCancel()) return;
    const value = this.form.getRawValue(); this.cancelling.set(true); this.cancelError.set('');
    this.api.cancel({ reference: booking.reference, email: value.email.trim() }).subscribe({
      next: (updated) => { this.booking.set(updated); this.cancelDialogRef?.nativeElement.close(); },
      error: (error: unknown) => {
        const code = error instanceof HttpErrorResponse ? (error.error as { code?: string })?.code : '';
        this.cancelError.set(code === 'CANCELLATION_NOT_ALLOWED' ? 'The cancellation deadline passed before this request. Look up the booking again to refresh its status.' : 'We could not cancel this booking. Please try again.');
        this.cancelling.set(false);
      },
      complete: () => this.cancelling.set(false),
    });
  }
  private todayInIndia(): string {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
    return `${part('year')}-${part('month')}-${part('day')}`;
  }
}
