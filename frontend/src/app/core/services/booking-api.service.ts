import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingLookupRequest, CreateBookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/bookings`;

  create(request: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, request);
  }

  lookup(request: BookingLookupRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/lookup`, request);
  }

  cancel(request: BookingLookupRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/cancel`, request);
  }
}
