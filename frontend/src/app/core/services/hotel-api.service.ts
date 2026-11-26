import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlternativesResponse } from '../models/alternatives.model';
import { City, HotelDetail, HotelSummary, PriceBreakdown } from '../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class HotelApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/cities`);
  }

  search(city?: string, checkIn?: string, checkOut?: string): Observable<HotelSummary[]> {
    let params = new HttpParams();
    if (city) params = params.set('city', city);
    if (checkIn) params = params.set('checkIn', checkIn);
    if (checkOut) params = params.set('checkOut', checkOut);
    return this.http.get<HotelSummary[]>(`${this.baseUrl}/hotels`, { params });
  }

  getHotel(id: number, checkIn?: string, checkOut?: string): Observable<HotelDetail> {
    let params = new HttpParams();
    if (checkIn) params = params.set('checkIn', checkIn);
    if (checkOut) params = params.set('checkOut', checkOut);
    return this.http.get<HotelDetail>(`${this.baseUrl}/hotels/${id}`, { params });
  }

  getHotelBySlug(slug: string, checkIn?: string, checkOut?: string): Observable<HotelDetail> {
    let params = new HttpParams();
    if (checkIn) params = params.set('checkIn', checkIn);
    if (checkOut) params = params.set('checkOut', checkOut);
    return this.http.get<HotelDetail>(`${this.baseUrl}/hotels/slug/${encodeURIComponent(slug)}`, { params });
  }

  quote(hotelId: number, checkIn: string, checkOut: string): Observable<PriceBreakdown> {
    const params = new HttpParams().set('checkIn', checkIn).set('checkOut', checkOut);
    return this.http.get<PriceBreakdown>(`${this.baseUrl}/hotels/${hotelId}/quote`, { params });
  }

  alternatives(hotelId: number, checkIn: string, checkOut: string): Observable<AlternativesResponse> {
    const params = new HttpParams().set('checkIn', checkIn).set('checkOut', checkOut);
    return this.http.get<AlternativesResponse>(`${this.baseUrl}/hotels/${hotelId}/alternatives`, { params });
  }
}
