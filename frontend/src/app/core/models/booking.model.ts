export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface BookingHotelSummary {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
}

export interface Booking {
  reference: string;
  status: BookingStatus;
  hotel: BookingHotelSummary;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  createdAt: string;
  cancelledAt: string | null;
}

export interface BookingLookupRequest {
  reference: string;
  email: string;
}

export interface CreateBookingRequest {
  hotelId: number;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
}
