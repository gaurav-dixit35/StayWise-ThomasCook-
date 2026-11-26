import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingApiService } from '../../core/services/booking-api.service';
import { HotelApiService } from '../../core/services/hotel-api.service';
import { BookingPage } from './booking.page';

describe('BookingPage guest form', () => {
  let page: BookingPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: BookingApiService, useValue: {} },
        { provide: HotelApiService, useValue: {} },
      ],
    });
    page = TestBed.runInInjectionContext(() => new BookingPage());
  });

  it('requires a name and valid email, then accepts valid guest details', () => {
    expect(page.form.invalid).toBe(true);
    page.markTouched('guestName');
    expect(page.showError('guestName')).toBe(true);
    expect(page.fieldError('guestName')).toBe('Enter your full name.');

    page.form.controls.guestName.setValue('Asha Guest');
    page.form.controls.guestEmail.setValue('not-an-email');
    expect(page.showError('guestEmail')).toBe(false);
    page.markTouched('guestEmail');
    expect(page.showError('guestEmail')).toBe(true);
    expect(page.fieldError('guestEmail')).toBe('Enter a valid email address.');

    page.form.controls.guestEmail.setValue('asha@example.test');
    expect(page.form.valid).toBe(true);
  });
});
